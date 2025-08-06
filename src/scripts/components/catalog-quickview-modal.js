// src/scripts/components/catalog-quickview-modal.js

import { LanguageManager } from '../managers/LanguageManager.js';

/**
 * CatalogQuickViewModal Component
 * Handles product quick view modal functionality for products catalogue page
 * @class CatalogQuickViewModal
 */
export class CatalogQuickViewModal {
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

    // Config - Different IDs for catalog modal to avoid conflicts
    this.config = {
      modalId: 'catalog-qv-modal-standalone',
      modalContentId: 'catalog-qv-modal-content',
      closeBtnId: 'catalog-qv-modal-close',
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
      console.log('✅ CatalogQuickViewModal initialized');
    }).catch(error => {
      console.error('❌ CatalogQuickViewModal initialization failed:', error);
    });
  }

  /**
   * Generate retail links HTML
   */
  generateRetailLinksHTML() {
    try {
      const currentData = LanguageManager.getCurrentLanguageData();
      const retailLinks = currentData.retailLink || ['Tokopedia', 'Shopee', 'Tiktok'];
      
      const linkConfigs = {
        'Tokopedia': {
          icon: 'simple-icons:tokopedia',
          color: '#42B549',
          url: '#tokopedia-link'
        },
        'Shopee': {
          icon: 'simple-icons:shopee',
          color: '#EE4D2D',
          url: '#shopee-link'
        },
        'Tiktok': {
          icon: 'simple-icons:tiktok',
          color: '#000000',
          url: '#tiktok-link'
        }
      };

      return retailLinks.map(platform => {
        const config = linkConfigs[platform] || { 
          icon: 'heroicons:link', 
          color: '#7c6baf', 
          url: '#' 
        };
        
        return `
          <a href="${config.url}" target="_blank" rel="noopener noreferrer"
             style="display:flex;align-items:center;justify-content:center;width:3.5rem;height:3.5rem;
                    background:${config.color};color:#fff;border-radius:0.75rem;
                    transition:all 0.2s;text-decoration:none;box-shadow:0 4px 8px rgba(0,0,0,0.1);"
             onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 12px rgba(0,0,0,0.15)'"
             onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)'"
             title="Beli di ${platform}">
            <iconify-icon icon="${config.icon}" style="font-size:1.5rem;"></iconify-icon>
          </a>
        `;
      }).join('');
    } catch (error) {
      console.error('Error generating retail links:', error);
      return '<div style="color:#888;font-size:0.9rem;">Retail links not available</div>';
    }
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
        const productCards = document.querySelectorAll('#productcatalogue-component .products-card, .products-card');
        
        if (modal && modalContent && productCards.length) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('CatalogQuickViewModal elements not found after maximum attempts'));
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
    
    // Look for product cards specifically in catalog context
    this.elements.productCards = Array.from(
      document.querySelectorAll('#productcatalogue-component .products-card, .products-card')
    );
    
    // Insert quick view buttons if not present
    this.elements.productCards.forEach(card => {
      let btn = card.querySelector('.catalog-qv-btn-quickview');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'catalog-qv-btn-quickview';
        btn.innerText = 'Quick View';
        btn.setAttribute('tabindex', '0');
        btn.style.cssText = `
          position:absolute;inset:0;z-index:20;opacity:0;transition:.3s;
          display:flex;align-items:center;justify-content:center;width:100%;height:100%;
          color:#fff;font-weight:600;background:rgba(0,0,0,0.5);font-size:1rem;pointer-events:none;
          border:none;border-radius:inherit;cursor:pointer;
        `;
        const imageWrapper = card.querySelector('.products-card-image-wrapper');
        if (imageWrapper) {
          imageWrapper.appendChild(btn);
        }
      }
    });
    
    this.elements.quickViewBtns = Array.from(document.querySelectorAll('.catalog-qv-btn-quickview'));
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
      
      // Show/hide button on hover/focus for catalog
      const parent = btn.parentElement;
      if (parent) {
        parent.addEventListener('mouseenter', () => {
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        });
        parent.addEventListener('mouseleave', () => {
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
        });
      }
      
      btn.addEventListener('focus', () => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      });
      btn.addEventListener('blur', () => {
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      });
    });

    // Modal close events
    if (this.elements.modal) {
      this.elements.modal.addEventListener('click', this.handleOverlayClick);
    }
    document.addEventListener('keydown', this.handleKeydown);

    // Dynamic close button observer
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
    if (!this.elements.modalContent) return;
    
    const observer = new MutationObserver(() => {
      const closeBtn = this.elements.modalContent.querySelector(`#${this.config.closeBtnId}`);
      if (closeBtn) {
        closeBtn.onclick = this.handleCloseClick;
      }
    });
    observer.observe(this.elements.modalContent, { childList: true, subtree: true });
  }

  /**
   * Open modal with product card data - Catalog specific styling
   */
  open(card) {
    if (this.isOpen || !this.elements.modal || !this.elements.modalContent) return;
    
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
        style="position:absolute;top:1rem;right:1rem;font-size:1.8rem;color:#888;background:none;border:none;cursor:pointer;z-index:10;">&times;</button>
      <div style="display:flex;gap:1.5rem;flex-direction:column;align-items:center;max-height:80vh;overflow-y:auto;">
        <div style="position:relative;">
          <img src="${img}" alt="${alt}" style="width:160px;height:160px;object-fit:cover;border-radius:1rem;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <div style="position:absolute;top:0.5rem;left:0.5rem;">${badges||''}</div>
        </div>
        <div style="text-align:center;width:100%;">
          <div style="color:#888;font-size:0.9rem;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.5px;">${category}</div>
          <h3 style="margin:0 0 1rem 0;font-size:1.3rem;font-weight:700;line-height:1.3;">${title}</h3>
          <div style="display:flex;align-items:center;justify-content:center;gap:.5rem;margin-bottom:1rem;">
            <span style="display:inline-flex;">${rating}</span>
            <span style="color:#888;font-size:.9rem;">${ratingCount}</span>
          </div>
          <div style="margin-bottom:1.5rem;">
            ${priceOriginal?`<span style="text-decoration:line-through;color:#aaa;margin-right:.5rem;font-size:1rem;">${priceOriginal}</span>`:''}
            <span style="font-size:1.5rem;font-weight:700;color:#7c6baf;">${priceSale}</span>
          </div>
          <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;align-items:center;">
            <div style="display:flex;gap:0.75rem;width:100%;margin-bottom:1rem;">
              <button type="button" style="background:transparent;color:#7c6baf;padding:.8em 1.8em;border:2px solid #7c6baf;border-radius:.6em;font-weight:600;font-size:1em;cursor:pointer;transition:all 0.2s;flex:1;"
                      onmouseover="this.style.background='#7c6baf';this.style.color='#fff'"
                      onmouseout="this.style.background='transparent';this.style.color='#7c6baf'">
                <span data-translate="common.view">Lihat Detail</span>
              </button>
              <button type="button" style="background:#25D366;color:#fff;padding:.8em 1.8em;border:2px solid #25D366;border-radius:.6em;font-weight:600;font-size:1em;cursor:pointer;transition:all 0.2s;flex:1;display:flex;align-items:center;justify-content:center;gap:0.5rem;"
                      onmouseover="this.style.background='#128C7E';this.style.borderColor='#128C7E'"
                      onmouseout="this.style.background='#25D366';this.style.borderColor='#25D366'">
                <iconify-icon icon="logos:whatsapp-icon" style="font-size:1.2rem;"></iconify-icon>
                <span data-translate="common.WhatsApp">WhatsApp</span>
              </button>
            </div>
            <div style="text-align:center;margin-bottom:0.5rem;width:100%;">
              <span style="color:#666;font-size:0.9rem;font-weight:500;">Tersedia di:</span>
            </div>
            ${this.generateRetailLinksHTML()}
          </div>
        </div>
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
    this.dispatchEvent('catalog-quickview:open');
  }

  /**
   * Close modal
   */
  close() {
    if (!this.isOpen || !this.elements.modal) return;
    
    this.elements.modal.style.display = 'none';
    document.body.style.overflow = '';
    this.isOpen = false;
    
    // Return focus to last trigger
    setTimeout(() => {
      if (this.elements.lastTrigger) this.elements.lastTrigger.focus();
    }, this.config.animationDuration);
    
    this.dispatchEvent('catalog-quickview:close');
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
    if (this.elements.modal) {
      this.elements.modal.removeEventListener('click', this.handleOverlayClick);
    }
    document.removeEventListener('keydown', this.handleKeydown);
    this.isInitialized = false;
    this.isOpen = false;
    this.elements = {};
    console.log('🗑️ CatalogQuickViewModal destroyed');
  }

  /**
   * Get component status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      isOpen: this.isOpen,
      modalExists: !!this.elements.modal,
      productCardsCount: this.elements.productCards.length,
      quickViewBtnsCount: this.elements.quickViewBtns.length
    };
  }
}

// Singleton instance
let catalogQuickViewModalInstance = null;

/**
 * Initialize CatalogQuickViewModal (singleton)
 */
export function initCatalogQuickViewModal() {
  if (!catalogQuickViewModalInstance) {
    catalogQuickViewModalInstance = new CatalogQuickViewModal();
  }
  return catalogQuickViewModalInstance;
}

/**
 * Get CatalogQuickViewModal instance
 */
export function getCatalogQuickViewModal() {
  return catalogQuickViewModalInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCatalogQuickViewModal);
} else {
  initCatalogQuickViewModal();
}

// Also initialize when components are loaded
window.addEventListener('componentsLoaded', () => {
  if (!catalogQuickViewModalInstance) {
    initCatalogQuickViewModal();
  }
});

// Export default
export default CatalogQuickViewModal;
