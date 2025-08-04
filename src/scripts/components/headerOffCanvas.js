// src/scripts/components/HeaderOffCanvas.js

/**
 * HeaderOffCanvas Component
 * Manages off-canvas mobile menu functionality
 * @class HeaderOffCanvas
 */
export class HeaderOffCanvas {
  constructor() {
    // Component state
    this.isOpen = false;
    this.isInitialized = false;
    
    // Element references
    this.elements = {
      toggle: null,
      close: null,
      overlay: null,
      panel: null,
      navLinks: null,
      header: null
    };
    
    // Bind methods to maintain context
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleNavLinkClick = this.handleNavLinkClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.updateActiveLink = this.updateActiveLink.bind(this);
    
    // Configuration
    this.config = {
      breakpoint: 768,
      scrollThreshold: 50,
      animationDuration: 300
    };
    
    console.log('🚀 HeaderOffCanvas constructor called');
    
    // Initialize when DOM is ready
    this.init();
  }
  
  /**
   * Initialize the component
   */
  init() {
    // Wait for component to be loaded
    this.waitForComponent().then(() => {
      this.cacheElements();
      this.attachEventListeners();
      this.isInitialized = true;
      console.log('✅ HeaderOffCanvas initialized successfully');
    }).catch(error => {
      console.error('❌ HeaderOffCanvas initialization failed:', error);
    });
  }
  
  /**
   * Wait for component elements to be available in DOM
   */
  async waitForComponent() {
    console.log('⏳ Waiting for HeaderOffCanvas elements...');
    
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const checkElements = () => {
        const toggle = document.getElementById('offcanvas-toggle');
        const panel = document.getElementById('offcanvas-panel');
        
        if (toggle && panel) {
          console.log('✅ HeaderOffCanvas elements found');
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('HeaderOffCanvas elements not found after maximum attempts'));
        } else {
          attempts++;
          setTimeout(checkElements, 100);
        }
      };
      
      checkElements();
    });
  }
  
  /**
   * Cache DOM element references
   */
  cacheElements() {
    this.elements = {
      toggle: document.getElementById('offcanvas-toggle'),
      close: document.getElementById('offcanvas-close'),
      overlay: document.getElementById('offcanvas-overlay'),
      panel: document.getElementById('offcanvas-panel'),
      navLinks: document.querySelectorAll('.headerOffCanvas__nav-link'),
      header: document.querySelector('.headerOffCanvas'),
      desktopLinks: document.querySelectorAll('.header-nav-link'),
      mobileLinks: document.querySelectorAll('.headerOffCanvas__nav-link')
    };
    
    console.log('📦 Elements cached:', this.elements);
  }
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Off-canvas controls
    if (this.elements.toggle) {
      this.elements.toggle.addEventListener('click', this.handleToggleClick);
    }
    
    if (this.elements.close) {
      this.elements.close.addEventListener('click', this.handleCloseClick);
    }
    
    if (this.elements.overlay) {
      this.elements.overlay.addEventListener('click', this.handleOverlayClick);
    }
    
    // Navigation links
    if (this.elements.navLinks) {
      this.elements.navLinks.forEach(link => {
        link.addEventListener('click', this.handleNavLinkClick);
      });
    }
    
    // Global events
    document.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('scroll', this.updateActiveLink, { passive: true });
    
    // Resize handler to close menu on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= this.config.breakpoint && this.isOpen) {
        this.close();
      }
    });
    
    console.log('👂 Event listeners attached');
  }
  
  /**
   * Handle toggle button click
   */
  handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggle();
  }
  
  /**
   * Handle close button click
   */
  handleCloseClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.close();
  }
  
  /**
   * Handle overlay click
   */
  handleOverlayClick(e) {
    e.preventDefault();
    this.close();
  }
  
  /**
   * Handle navigation link click
   */
  handleNavLinkClick(e) {
    // Only close on mobile
    if (window.innerWidth < this.config.breakpoint) {
      // Small delay to allow navigation
      setTimeout(() => {
        this.close();
      }, 100);
    }
  }
  
  /**
   * Handle keyboard events
   */
  handleKeydown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
    
    // Tab trap when menu is open
    if (e.key === 'Tab' && this.isOpen) {
      this.handleTabTrap(e);
    }
  }
  
  /**
   * Handle tab trapping for accessibility
   */
  handleTabTrap(e) {
    const focusableElements = this.elements.panel.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
  
  /**
   * Handle scroll events for header
   */
  handleScroll() {
    if (!this.elements.header) return;
    
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > this.config.scrollThreshold) {
      this.elements.header.classList.add('header--scrolled');
    } else {
      this.elements.header.classList.remove('header--scrolled');
    }
  }
  
  /**
   * Update active navigation link based on scroll position
   */
  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Update desktop links
        this.elements.desktopLinks?.forEach(link => {
          link.classList.remove('header-nav-link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('header-nav-link--active');
          }
        });
        
        // Update mobile links
        this.elements.mobileLinks?.forEach(link => {
          link.classList.remove('headerOffCanvas__nav-link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('headerOffCanvas__nav-link--active');
          }
        });
      }
    });
  }
  
  /**
   * Toggle off-canvas menu
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  /**
   * Open off-canvas menu
   */
  open() {
    if (this.isOpen) return;
    
    console.log('📂 Opening off-canvas menu');
    
    // Add active classes
    this.elements.toggle?.classList.add('headerOffCanvas__toggle--active');
    this.elements.overlay?.classList.add('headerOffCanvas__overlay--active');
    this.elements.panel?.classList.add('headerOffCanvas__panel--active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Update state
    this.isOpen = true;
    
    // Focus management for accessibility
    setTimeout(() => {
      this.elements.close?.focus();
    }, this.config.animationDuration);
    
    // Dispatch custom event
    this.dispatchEvent('offcanvas:open');
  }
  
  /**
   * Close off-canvas menu
   */
  close() {
    if (!this.isOpen) return;
    
    console.log('📁 Closing off-canvas menu');
    
    // Remove active classes
    this.elements.toggle?.classList.remove('headerOffCanvas__toggle--active');
    this.elements.overlay?.classList.remove('headerOffCanvas__overlay--active');
    this.elements.panel?.classList.remove('headerOffCanvas__panel--active');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Update state
    this.isOpen = false;
    
    // Return focus to toggle button
    setTimeout(() => {
      this.elements.toggle?.focus();
    }, this.config.animationDuration);
    
    // Dispatch custom event
    this.dispatchEvent('offcanvas:close');
  }
  
  /**
   * Dispatch custom events
   */
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: {
        ...detail,
        isOpen: this.isOpen
      },
      bubbles: true
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * Destroy the component and clean up
   */
  destroy() {
    console.log('🗑️ Destroying HeaderOffCanvas component');
    
    // Remove event listeners
    this.elements.toggle?.removeEventListener('click', this.handleToggleClick);
    this.elements.close?.removeEventListener('click', this.handleCloseClick);
    this.elements.overlay?.removeEventListener('click', this.handleOverlayClick);
    
    this.elements.navLinks?.forEach(link => {
      link.removeEventListener('click', this.handleNavLinkClick);
    });
    
    document.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('scroll', this.updateActiveLink);
    
    // Close menu if open
    if (this.isOpen) {
      this.close();
    }
    
    // Clear references
    this.elements = {};
    this.isInitialized = false;
  }
}

// Create singleton instance
let headerOffCanvasInstance = null;

/**
 * Initialize HeaderOffCanvas
 * Ensures only one instance exists
 */
export function initHeaderOffCanvas() {
  if (!headerOffCanvasInstance) {
    headerOffCanvasInstance = new HeaderOffCanvas();
  }
  return headerOffCanvasInstance;
}

/**
 * Get HeaderOffCanvas instance
 */
export function getHeaderOffCanvas() {
  return headerOffCanvasInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderOffCanvas);
} else {
  // DOM already loaded
  initHeaderOffCanvas();
}

// Also initialize when components are loaded
window.addEventListener('componentsLoaded', () => {
  console.log('🔄 Components loaded, checking HeaderOffCanvas...');
  if (!headerOffCanvasInstance) {
    initHeaderOffCanvas();
  }
});

// Export for use in other modules
export default HeaderOffCanvas;
