// src/scripts/components/QuickViewModal.js

/**
 * QuickViewModal Component
 * Handles product quick view modal functionality for products grid
 * @class QuickViewModal
 */
export class QuickViewModal {
  constructor() {
    this.isOpen = false;
    this.isInitialized = false;

    // Element references
    this.elements = {
      modal: null,
      modalContent: null,
      closeBtn: null,
      lastTrigger: null,
      productCards: [],
      quickViewBtns: []
    };

    // Bind methods
    this.handleQuickViewClick = this.handleQuickViewClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    // Config
    this.config = {
      modalId: 'qv-modal-standalone',
      modalContentId: 'qv-modal-content',
      closeBtnId: 'qv-modal-close',
      animationDuration: 200
    };

    // Initialize when DOM ready
    this.init();
  }

  /**
   * Initialize the component
   */
  init() {
    this.waitForComponent().then(() => {
      this.cacheElements();
      this.attachEventListeners();
      this.isInitialized = true;
      console.log('✅ QuickViewModal initialized');
    }).catch(error => {
      console.error('❌ QuickViewModal initialization failed:', error);
    });
  }

  /**
   * Wait for modal and product grid to be available in DOM
   */
  async waitForComponent() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      const check = () => {
        const modal = document.getElementById(this.config.modalId);
        const modalContent = document.getElementById(this.config.modalContentId);
        const productCards = document.querySelectorAll('.products-card');
        if (modal && modalContent && productCards.length) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('QuickViewModal elements not found after maximum attempts'));
        } else {
          attempts++;
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  /**
   * Cache DOM element references
   */
  cacheElements() {
    this.elements.modal = document.getElementById(this.config.modalId);
    this.elements.modalContent = document.getElementById(this.config.modalContentId);
    this.elements.productCards = Array.from(document.querySelectorAll('.products-card'));
    // Insert quick view buttons if not present
    this.elements.productCards.forEach(card => {
      let btn = card.querySelector('.qv-btn-quickview');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'qv-btn-quickview';
        btn.innerText = 'Quick View';
        btn.setAttribute('tabindex', '0');
        btn.style.cssText = `
          position:absolute;inset:0;z-index:20;opacity:0;transition:.3s;
          display:flex;align-items:center;justify-content:center;width:100%;height:100%;
          color:#fff;font-weight:600;background:rgba(0,0,0,0.5);font-size:1rem;pointer-events:none;
          border:none;border-radius:inherit;cursor:pointer;
        `;
        card.querySelector('.products-card-image-wrapper').appendChild(btn);
      }
    });
    this.elements.quickViewBtns = Array.from(document.querySelectorAll('.qv-btn-quickview'));
    this.elements.closeBtn = document.getElementById(this.config.closeBtnId);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Quick view buttons
    this.elements.quickViewBtns.forEach(btn => {
      btn.addEventListener('click', this.handleQuickViewClick);
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleQuickViewClick(e);
        }
      });
      // Show button on hover/focus
      btn.parentElement.addEventListener('mouseenter', () => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      });
      btn.parentElement.addEventListener('mouseleave', () => {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      });
      btn.addEventListener('focus', () => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      });
      btn.addEventListener('blur', () => {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      });
    });

    // Modal close
    this.elements.modal.addEventListener('click', this.handleOverlayClick);
    document.addEventListener('keydown', this.handleKeydown);

    // Dynamic close button (rebuilt on modal open)
    this.observeModalContent();
  }

  /**
   * Handle quick view button click
   */
  handleQuickViewClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const btn = e.currentTarget;
    const card = btn.closest('.products-card');
    if (!card) return;
    this.elements.lastTrigger = btn;
    this.open(card);
  }

  /**
   * Handle modal close button click
   */
  handleCloseClick(e) {
    e.preventDefault();
    this.close();
  }

  /**
   * Handle overlay click (outside modal content)
   */
  handleOverlayClick(e) {
    if (e.target === this.elements.modal) {
      this.close();
    }
  }

  /**
   * Handle keyboard events for accessibility
   */
  handleKeydown(e) {
    if (!this.isOpen) return;
    if (e.key === 'Escape') {
      this.close();
    }
    // Trap tab focus inside modal
    if (e.key === 'Tab') {
      const focusable = this.elements.modalContent.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /**
   * Observe modal content for dynamic close button
   */
  observeModalContent() {
    const observer = new MutationObserver(() => {
      const closeBtn = this.elements.modalContent.querySelector(`#${this.config.closeBtnId}`);
      if (closeBtn) {
        closeBtn.onclick = this.handleCloseClick;
      }
    });
    observer.observe(this.elements.modalContent, { childList: true, subtree: true });
  }

  /**
   * Open modal with product card data
   */
  open(card) {
    if (this.isOpen) return;
    const img = card.querySelector('.products-card-image')?.src || '';
    const alt = card.querySelector('.products-card-image')?.alt || '';
    const title = card.querySelector('.products-card-title')?.textContent || '';
    const category = card.querySelector('.products-card-category')?.textContent || '';
    const rating = card.querySelector('.products-rating-stars')?.innerHTML || '';
    const ratingCount = card.querySelector('.products-rating-count')?.textContent || '';
    const priceOriginal = card.querySelector('.products-price-original')?.textContent || '';
    const priceSale = card.querySelector('.products-price-sale')?.textContent || '';
    const badges = card.querySelector('.products-badges')?.innerHTML || '';

    this.elements.modalContent.innerHTML = `
      <button type="button" id="${this.config.closeBtnId}" aria-label="Tutup"
        style="position:absolute;top:1rem;right:1rem;font-size:1.8rem;color:#888;background:none;border:none;cursor:pointer;">&times;</button>
      <div style="display:flex;gap:1rem;flex-direction:column;align-items:center;">
        <img src="${img}" alt="${alt}" style="width:140px;height:140px;object-fit:cover;border-radius:1rem;">
        <div style="align-self:flex-start;margin-bottom:.5rem;">${badges||''}</div>
        <div style="align-self:flex-start;color:#888;font-size:.97rem;">${category}</div>
        <h3 style="margin:0 0 .5rem 0;font-size:1.25rem;font-weight:700;">${title}</h3>
        <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem;">
          <span style="display:inline-flex;">${rating}</span>
          <span style="color:#888;font-size:.97rem;">${ratingCount}</span>
        </div>
        <div>
          ${priceOriginal?`<span style="text-decoration:line-through;color:#aaa;margin-right:.5rem;">${priceOriginal}</span>`:''}
          <span style="font-size:1.4rem;font-weight:700;color:#7c6baf;">${priceSale}</span>
        </div>
        <button type="button" style="margin-top:1rem;background:#5b4b8a;color:#fff;padding:.9em 2em;border-radius:.7em;font-weight:600;font-size:1em;border:none;cursor:pointer;">Tambah ke Keranjang</button>
      </div>
    `;
    this.elements.modal.style.display = 'flex';
    setTimeout(() => {
      // Focus close button for accessibility
      const closeBtn = this.elements.modalContent.querySelector(`#${this.config.closeBtnId}`);
      if (closeBtn) closeBtn.focus();
      // Re-scan iconify if present
      if (window.Iconify && window.Iconify.scan) window.Iconify.scan();
    }, this.config.animationDuration);
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    this.dispatchEvent('quickview:open');
  }

  /**
   * Close modal
   */
  close() {
    if (!this.isOpen) return;
    this.elements.modal.style.display = 'none';
    document.body.style.overflow = '';
    this.isOpen = false;
    // Return focus to last trigger
    setTimeout(() => {
      if (this.elements.lastTrigger) this.elements.lastTrigger.focus();
    }, this.config.animationDuration);
    this.dispatchEvent('quickview:close');
  }

  /**
   * Dispatch custom events
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: { ...detail, isOpen: this.isOpen },
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    this.elements.quickViewBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleQuickViewClick);
    });
    this.elements.modal.removeEventListener('click', this.handleOverlayClick);
    document.removeEventListener('keydown', this.handleKeydown);
    this.isInitialized = false;
    this.isOpen = false;
    this.elements = {};
    console.log('🗑️ QuickViewModal destroyed');
  }
}

// Singleton instance
let quickViewModalInstance = null;

/**
 * Initialize QuickViewModal (singleton)
 */
export function initQuickViewModal() {
  if (!quickViewModalInstance) {
    quickViewModalInstance = new QuickViewModal();
  }
  return quickViewModalInstance;
}

/**
 * Get QuickViewModal instance
 */
export function getQuickViewModal() {
  return quickViewModalInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuickViewModal);
} else {
  initQuickViewModal();
}

// Also initialize when components are loaded
window.addEventListener('componentsLoaded', () => {
  if (!quickViewModalInstance) {
    initQuickViewModal();
  }
});

// Export default
export default QuickViewModal;
