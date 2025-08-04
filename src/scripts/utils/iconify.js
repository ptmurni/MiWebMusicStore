/**
 * Iconify Utilities
 * Handles icon loading, rendering, and management
 */

export class IconifyUtils {
  static loadedSets = new Set();
  static observers = [];
  static fallbackMap = {
    'truck': '🚛',
    'phone': '📞',
    'envelope': '✉️',
    'map': '📍',
    'check': '✅',
    'star': '⭐',
    'arrow': '→',
    'magnifying': '🔍',
    'calculator': '🧮',
    'play': '▶️',
    'paper-airplane': '✈️',
    'bars': '☰',
    'home': '🏠',
    'user': '👤',
    'users': '👥',
    'heart': '❤️',
    'thumbs-up': '👍',
    'warning': '⚠️',
    'info': 'ℹ️',
    'x': '✕',
    'plus': '➕',
    'minus': '➖'
  };

  /**
   * Initialize Iconify system
   */
  static init() {
    // Ensure Iconify is loaded
    IconifyUtils.ensureIconifyLoaded();
    
    // Convert legacy iconify elements
    IconifyUtils.convertIconifyElements();
    
    // Setup observers and handlers
    IconifyUtils.initIconObserver();
    IconifyUtils.setupDynamicIconHandling();
    
    // Add fallback handling
    IconifyUtils.setupFallbackHandling();

    console.log('✅ Iconify utilities initialized');
  }

  /**
   * Ensure Iconify is loaded and working
   */
  static ensureIconifyLoaded() {
    // Check if iconify-icon is available
    if (typeof customElements !== 'undefined' && customElements.get('iconify-icon')) {
      console.log('Iconify is loaded and ready');
      return true;
    }
    
    // If not loaded, try to load it
    if (!document.querySelector('script[src*="iconify"]')) {
      console.log('Loading Iconify from CDN...');
      const script = document.createElement('script');
      script.src = 'https://code.iconify.design/3/3.1.1/iconify.min.js';
      script.onload = () => {
        console.log('Iconify loaded from CDN');
        setTimeout(() => {
          IconifyUtils.convertIconifyElements();
          IconifyUtils.processAllIcons();
        }, 100);
      };
      script.onerror = () => {
        console.warn('Failed to load Iconify from CDN, using fallbacks');
        IconifyUtils.addFallbackIcons();
      };
      document.head.appendChild(script);
    }
    
    return false;
  }

  /**
   * Convert legacy .iconify elements to iconify-icon elements
   */
  static convertIconifyElements() {
    const iconifyElements = document.querySelectorAll('.iconify');
    
    iconifyElements.forEach(element => {
      try {
        const icon = element.getAttribute('data-icon');
        
        // Safely get className
        let classes = '';
        if (element.className && typeof element.className === 'string') {
          classes = element.className.replace('iconify', '').trim();
        } else if (element.className && element.className.baseVal) {
          classes = element.className.baseVal.replace('iconify', '').trim();
        }
        
        if (icon) {
          const iconifyIcon = document.createElement('iconify-icon');
          iconifyIcon.setAttribute('icon', icon);
          if (classes) {
            iconifyIcon.className = classes;
          }
          
          // Copy other attributes except data-icon and class
          Array.from(element.attributes).forEach(attr => {
            if (attr.name !== 'data-icon' && attr.name !== 'class') {
              iconifyIcon.setAttribute(attr.name, attr.value);
            }
          });
          
          // Replace the element
          if (element.parentNode) {
            element.parentNode.replaceChild(iconifyIcon, element);
          }
        }
      } catch (error) {
        console.warn('Error converting iconify element:', error, element);
      }
    });
  }

  /**
   * Initialize icon observer for dynamic content
   */
  static initIconObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            IconifyUtils.processIconsInElement(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    IconifyUtils.observers.push(observer);
  }

  /**
   * Process icons in element
   */
  static processIconsInElement(element) {
    // Find all iconify-icon elements
    const icons = element.querySelectorAll('iconify-icon');
    icons.forEach(icon => {
      IconifyUtils.ensureIconLoaded(icon);
    });

    // Also check if the element itself is an icon
    if (element.tagName === 'ICONIFY-ICON') {
      IconifyUtils.ensureIconLoaded(element);
    }
  }

  /**
   * Ensure icon is loaded
   */
  static ensureIconLoaded(iconElement) {
    const iconName = iconElement.getAttribute('icon');
    if (iconName && !iconElement.shadowRoot) {
      IconifyUtils.queueIconForRetry(iconElement);
    }
  }

  /**
   * Queue icon for retry
   */
  static queueIconForRetry(iconElement) {
    setTimeout(() => {
      if (!iconElement.shadowRoot && !iconElement.innerHTML.includes('svg')) {
        const iconName = iconElement.getAttribute('icon');
        iconElement.removeAttribute('icon');
        setTimeout(() => {
          iconElement.setAttribute('icon', iconName);
        }, 10);
      }
    }, 1000);
  }

  /**
   * Setup dynamic icon handling
   */
  static setupDynamicIconHandling() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        IconifyUtils.processAllIcons();
      });
    } else {
      IconifyUtils.processAllIcons();
    }
  }

  /**
   * Setup fallback handling
   */
  static setupFallbackHandling() {
    // Check for failed icons after a delay
    setTimeout(() => {
      IconifyUtils.addFallbackIcons();
    }, 3000);
  }

  /**
   * Process all icons in document
   */
  static processAllIcons() {
    const icons = document.querySelectorAll('iconify-icon');
    console.log(`Processing ${icons.length} icons`);
    
    icons.forEach(icon => {
      IconifyUtils.ensureIconLoaded(icon);
    });
  }

  /**
   * Add fallback icons for failed loads
   */
  static addFallbackIcons() {
    const iconifyElements = document.querySelectorAll('iconify-icon, .iconify');
    
    iconifyElements.forEach(element => {
      try {
        setTimeout(() => {
          const hasContent = element.innerHTML.includes('<svg') ||
                           element.querySelector('svg') ||
                           element.shadowRoot;
          
          if (!hasContent) {
            const iconName = element.getAttribute('icon') || element.getAttribute('data-icon');
            const fallback = IconifyUtils.getFallbackIcon(iconName);
            
            if (fallback) {
              element.innerHTML = fallback;
              element.style.fontFamily = 'emoji, system-ui';
              element.style.display = 'inline-block';
            }
          }
        }, 500);
      } catch (error) {
        console.warn('Error adding fallback icon:', error, element);
      }
    });
  }

  /**
   * Get fallback icon for given icon name
   */
  static getFallbackIcon(iconName) {
    if (!iconName) return '●';
    
    const name = iconName.toLowerCase();
    
    for (const [key, emoji] of Object.entries(IconifyUtils.fallbackMap)) {
      if (name.includes(key)) {
        return emoji;
      }
    }
    
    return '●';
  }

  /**
   * Create icon element
   */
  static createIcon(iconName, options = {}) {
    const {
      size = '24',
      className = '',
      inline = false,
      style = {}
    } = options;

    const icon = document.createElement('iconify-icon');
    icon.setAttribute('icon', iconName);
    
    if (size) {
      icon.setAttribute('width', size);
      icon.setAttribute('height', size);
    }
    
    if (className) {
      icon.className = className;
    }
    
    if (inline) {
      icon.setAttribute('inline', 'true');
    }

    Object.assign(icon.style, style);
    return icon;
  }

  /**
   * Debug iconify elements
   */
  static debugIconifyElements() {
    const iconifyElements = document.querySelectorAll('.iconify, iconify-icon');
    console.log(`Found ${iconifyElements.length} iconify elements:`, iconifyElements);
    
    iconifyElements.forEach((element, index) => {
      console.log(`Element ${index}:`, {
        tagName: element.tagName,
        className: element.className,
        dataIcon: element.getAttribute('data-icon'),
        icon: element.getAttribute('icon'),
        innerHTML: element.innerHTML,
        hasShadowRoot: !!element.shadowRoot
      });
    });
  }

  /**
   * Get icon usage statistics
   */
  static getUsageStats() {
    const icons = document.querySelectorAll('iconify-icon');
    const stats = {};
    
    icons.forEach(icon => {
      const iconName = icon.getAttribute('icon');
      if (iconName) {
        stats[iconName] = (stats[iconName] || 0) + 1;
      }
    });

    return {
      totalIcons: icons.length,
      uniqueIcons: Object.keys(stats).length,
      iconCounts: stats,
      loadedSets: IconifyUtils.loadedSets
    };
  }

  /**
   * Clean up observers and resources
   */
  static cleanup() {
    IconifyUtils.observers.forEach(observer => {
      observer.disconnect();
    });
    IconifyUtils.observers = [];
  }
}

// Export legacy functions for backward compatibility
export const convertIconifyElements = () => IconifyUtils.convertIconifyElements();
export const ensureIconifyLoaded = () => IconifyUtils.ensureIconifyLoaded();
export const addFallbackIcons = () => IconifyUtils.addFallbackIcons();
export const debugIconifyElements = () => IconifyUtils.debugIconifyElements();
