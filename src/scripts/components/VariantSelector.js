// src/scripts/components/VariantSelector.js
import { variantManager } from '../managers/VariantManager.js';

export class VariantSelector {
  constructor() {
    this.isOpen = false;
    this.skipNotification = false; // Flag to prevent double notifications
    console.log('🎨 VariantSelector constructor called');
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready and component to be loaded
    this.waitForComponent().then(() => {
      this.attachEventListeners();
      
      // Safely get current variant
      const currentVariant = variantManager.getVariant();
      if (currentVariant) {
        this.updateActiveVariant(currentVariant);
      }
      
      // Listen for variant changes
      variantManager.onVariantChange((variantName) => {
        this.updateActiveVariant(variantName);
        
        // Show notification for programmatic changes only
        if (!this.skipNotification) {
          const activeOption = document.querySelector(`[data-variant="${variantName}"]`);
          const variantDisplayName = activeOption && activeOption.dataset.name ? activeOption.dataset.name : variantName;
          this.showNotification(`Variant applied: ${variantDisplayName}`);
        }
        this.skipNotification = false; // Reset flag
      });
      
      console.log('✅ VariantSelector initialized successfully');
    });
  }
  
  async waitForComponent() {
    console.log('🎨 Waiting for variant component to load...');
    return new Promise((resolve) => {
      const checkComponent = () => {
        const toggleBtn = document.getElementById('variant-toggle-btn');
        if (toggleBtn) {
          console.log('✅ Variant component found!');
          resolve();
        } else {
          console.log('⏳ Variant component not found, retrying...');
          setTimeout(checkComponent, 100);
        }
      };
      checkComponent();
    });
  }
  
  attachEventListeners() {
    const toggle = document.getElementById('variant-toggle-btn');
    const panel = document.getElementById('variant-options');
    
    if (!toggle || !panel) {
      console.error('❌ VariantSelector: Required elements not found');
      return;
    }
    
    // Toggle panel
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePanel();
    });
    
    // Close on outside click - IMPROVED VERSION
    document.addEventListener('click', (e) => {
      // Only close if panel is actually open
      if (!this.isOpen) return;
      
      // Don't close if clicking on toggle or panel
      if (toggle.contains(e.target) || panel.contains(e.target)) return;
      
      // Don't close if clicking on other UI components
      const clickedElement = e.target;
      const isUIComponent = 
        clickedElement.closest('.headerOffCanvas__toggle') || // Header toggle
        clickedElement.closest('#offcanvas-toggle') || // Off-canvas toggle
        clickedElement.closest('#offcanvas-panel') || // Off-canvas panel
        clickedElement.closest('#offcanvas-overlay') || // Off-canvas overlay
        clickedElement.closest('#lang-toggle-btn') || // Language toggle
        clickedElement.closest('#lang-options') || // Language options
        clickedElement.closest('.language-selector') || // Language selector container
        clickedElement.closest('.variant-notification') || // Variant notification
        clickedElement.closest('[role="dialog"]') || // Any modal/dialog
        clickedElement.closest('[role="menu"]'); // Any dropdown menu
      
      if (isUIComponent) {
        console.log('🛡️ Click on UI component detected, not closing variant panel');
        return;
      }
      
      this.closePanel();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        console.log('⌨️ Escape pressed - closing variant panel');
        this.closePanel();
      }
    });
    
    // Variant selection
    document.addEventListener('click', (e) => {
      const option = e.target.closest('.variant-option');
      if (option && this.isOpen) { // Only process if panel is open
        const variantId = option.dataset.variant;
        const variantName = option.dataset.name;
        console.log(`🎨 Variant selected: ${variantId}`);
        
        // Set flag to skip notification from variant change listener
        this.skipNotification = true;
        
        variantManager.setVariant(variantId);
        
        // Show notification
        this.showNotification(`Variant changed to ${variantName}`);
        
        // Animation feedback
        option.classList.add('scale-95');
        setTimeout(() => {
          option.classList.remove('scale-95');
          this.closePanel();
        }, 150);
      }
    });
    
    console.log('👂 VariantSelector event listeners attached');
  }
  
  togglePanel() {
    if (this.isOpen) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }
  
  openPanel() {
    const panel = document.getElementById('variant-options');
    if (panel) {
      panel.style.transform = 'scale(1)';
      panel.style.opacity = '1';
      panel.classList.remove('scale-0', 'opacity-0');
      panel.classList.add('scale-100', 'opacity-100');
      this.isOpen = true;
      console.log('🎨 Variant panel opened');
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('variantpanel:open'));
    }
  }
  
  closePanel() {
    const panel = document.getElementById('variant-options');
    if (panel && this.isOpen) { // Add isOpen check
      panel.style.transform = 'scale(0)';
      panel.style.opacity = '0';
      panel.classList.remove('scale-100', 'opacity-100');
      panel.classList.add('scale-0', 'opacity-0');
      this.isOpen = false;
      console.log('🎨 Variant panel closed');
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('variantpanel:close'));
    }
  }
  
  updateActiveVariant(variantName) {
    if (!variantName) {
      console.warn('⚠️ updateActiveVariant called with undefined variant');
      return;
    }
    
    console.log(`🎨 Updating active variant to: ${variantName}`);
    
    // Update current variant display
    const currentVariantDisplay = document.getElementById('current-variant-display');
    if (currentVariantDisplay) {
      const activeOption = document.querySelector(`[data-variant="${variantName}"]`);
      
      let displayName;
      if (activeOption && activeOption.dataset.name) {
        displayName = activeOption.dataset.name.toUpperCase();
      } else {
        // Fallback to variant name if option not found or no data-name
        displayName = variantName.toUpperCase();
      }
      
      currentVariantDisplay.textContent = displayName;
    }
    
    // Update checkmarks and active states
    document.querySelectorAll('.variant-option').forEach(option => {
      const checkmark = option.querySelector('.variant-active');
      if (checkmark) {
        if (option.dataset.variant === variantName) {
          checkmark.classList.remove('hidden');
          option.classList.add('active');
        } else {
          checkmark.classList.add('hidden');
          option.classList.remove('active');
        }
      }
    });
    
    // Update body data attribute for dynamic styling
    document.body.setAttribute('data-current-variant', variantName);
  }
  
  /**
   * Show notification
   */
  showNotification(message) {
    // Create or update notification
    let notification = document.getElementById('variant-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'variant-notification';
      notification.className = 'variant-notification'; // Add class for easier selection
      notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
        font-weight: 500;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 280px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      `;
      
      // Add icon
      const icon = document.createElement('div');
      icon.innerHTML = '🎨';
      icon.style.cssText = `
        font-size: 16px;
        flex-shrink: 0;
      `;
      notification.appendChild(icon);
      
      // Add text container
      const textContainer = document.createElement('div');
      textContainer.style.cssText = 'flex: 1; min-width: 0;';
      notification.appendChild(textContainer);
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
        flex-shrink: 0;
      `;
      closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
      });
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.backgroundColor = 'transparent';
      });
      notification.appendChild(closeBtn);
      
      document.body.appendChild(notification);
    }

    const textContainer = notification.querySelector('div:nth-child(2)');
    if (textContainer) {
      textContainer.textContent = message;
    }
    
    // Show notification
    notification.style.transform = 'translateX(0)';

    // Auto hide after 4 seconds
    setTimeout(() => {
      if (notification && notification.style.transform === 'translateX(0px)') {
        notification.style.transform = 'translateX(100%)';
      }
    }, 4000);
  }
  
  /**
   * Get current variant
   */
  getCurrentVariant() {
    return variantManager.getVariant();
  }
  
  /**
   * Change variant programmatically
   */
  changeVariant(variantId) {
    const activeOption = document.querySelector(`[data-variant="${variantId}"]`);
    if (activeOption) {
      const variantName = activeOption.dataset.name;
      this.skipNotification = true;
      variantManager.setVariant(variantId);
      this.showNotification(`Variant changed to ${variantName}`);
      console.log(`🎨 Variant changed programmatically to: ${variantName} (${variantId})`);
    } else {
      console.warn(`⚠️ Variant ${variantId} not found`);
    }
  }
}

// Auto-initialize when DOM is ready
let variantSelectorInstance = null;

function initVariantSelector() {
  console.log('🚀 Initializing Variant Selector...');
  
  if (!variantSelectorInstance) {
    variantSelectorInstance = new VariantSelector();
    window.variantSelector = variantSelectorInstance;
    console.log('✅ Variant Selector instance created');
  } else {
    console.log('⚠️ Variant Selector already exists');
  }
}

// Listen for DOM ready
if (document.readyState === 'loading') {
  console.log('📄 DOM loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initVariantSelector);
} else {
  console.log('📄 DOM already ready, initializing immediately...');
  initVariantSelector();
}

// Also listen for components loaded
window.addEventListener('componentsLoaded', () => {
  console.log('📦 Components loaded event received');
  if (!variantSelectorInstance) {
    console.log('🔄 Retrying Variant Selector initialization...');
    initVariantSelector();
  }
});

// Export for manual initialization
export { initVariantSelector };

export default VariantSelector;
