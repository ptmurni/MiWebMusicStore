/**
 * Language Selector Component
 * Works with existing language-selector.html component
 */

// Import CSS for language selector
import '../../styles/utilities/language-selector.css';

export class LanguageSelector {
  constructor() {
    this.currentLang = 'id';
    this.isOpen = false;
    
    this.languages = {
      'id': 'Bahasa Indonesia',
      'en': 'English', 
      'ms': 'Bahasa Malaysia'
    };

    this.init();
  }

  /**
   * Initialize the language selector
   */
  init() {
    this.loadSavedLanguage();
    this.waitForComponent();
    
    console.log('🌐 Language Selector initialized');
  }

  /**
   * Wait for language selector component to be loaded
   */
  waitForComponent() {
    console.log('🔍 Waiting for language-selector component...');
    
    const checkComponent = () => {
      const selector = document.getElementById('language-selector');
      console.log('🔍 Checking for #language-selector:', !!selector);
      
      if (selector) {
        console.log('✅ Language selector component found!');
        this.bindEvents();
        this.updateDisplay();
        console.log('✅ Language selector initialized successfully');
      } else {
        console.log('⏳ Language selector not found, retrying...');
        // Try again after a short delay
        setTimeout(checkComponent, 200);
      }
    };
    
    checkComponent();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    const toggleBtn = document.getElementById('lang-toggle-btn');
    const langOptions = document.querySelectorAll('.lang-option');

    console.log('🔧 Binding events...');
    console.log('Toggle button found:', !!toggleBtn);
    console.log('Language options found:', langOptions.length);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('🖱️ Toggle button clicked!');
        this.toggleMenu();
      });
    }

    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const langCode = option.getAttribute('data-lang');
        const langName = option.getAttribute('data-name');
        console.log(`🌐 Language selected: ${langCode} (${langName})`);
        this.selectLanguage(langCode, langName);
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      if (this.isOpen) {
        console.log('👆 Outside click - closing menu');
        this.closeMenu();
      }
    });

    // Prevent menu close when clicking inside
    const langOptionsMenu = document.getElementById('lang-options');
    if (langOptionsMenu) {
      langOptionsMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        console.log('⌨️ Escape pressed - closing menu');
        this.closeMenu();
      }
    });

    console.log('✅ Event listeners bound successfully');
  }

  /**
   * Toggle menu visibility
   */
  toggleMenu() {
    console.log(`🔄 Toggling menu. Currently open: ${this.isOpen}`);
    
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Open the language menu
   */
  openMenu() {
    const menu = document.getElementById('lang-options');
    console.log('📂 Opening menu...', !!menu);
    
    if (menu) {
      // Force show with both classes and inline styles
      menu.classList.remove('scale-0', 'opacity-0');
      menu.classList.add('scale-100', 'opacity-100');
      menu.style.transform = 'scale(1)';
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      this.isOpen = true;
      console.log('✅ Menu opened');
    } else {
      console.error('❌ Menu element not found!');
    }
  }

  /**
   * Close the language menu
   */
  closeMenu() {
    const menu = document.getElementById('lang-options');
    console.log('📁 Closing menu...', !!menu);
    
    if (menu) {
      // Force hide with both classes and inline styles
      menu.classList.remove('scale-100', 'opacity-100');
      menu.classList.add('scale-0', 'opacity-0');
      menu.style.transform = 'scale(0)';
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
      this.isOpen = false;
      console.log('✅ Menu closed');
    }
  }

  /**
   * Select a language
   */
  selectLanguage(langCode, langName) {
    this.currentLang = langCode;
    this.updateDisplay();
    this.saveLanguagePreference(langCode);
    this.closeMenu();

    // Dispatch custom event for LanguageManager
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { 
        language: langCode, 
        name: langName 
      }
    }));

    // Show notification
    this.showNotification(`Language changed to ${langName}`);
    console.log(`🌐 Language changed to: ${langName} (${langCode})`);
  }

  /**
   * Update the display with current language
   */
  updateDisplay() {
    const currentDisplay = document.getElementById('current-lang-display');
    if (currentDisplay) {
      currentDisplay.textContent = this.currentLang.toUpperCase();
    }

    // Update active state
    document.querySelectorAll('.lang-option').forEach(option => {
      const langCode = option.getAttribute('data-lang');
      const isActive = langCode === this.currentLang;
      
      // Hide all checkmarks first
      const checkmark = option.querySelector('.lang-active');
      if (checkmark) {
        checkmark.classList.toggle('hidden', !isActive);
      }
    });
  }

  /**
   * Save language preference to localStorage
   */
  saveLanguagePreference(lang) {
    try {
      localStorage.setItem('MiWebMusicStore_language', lang);
      document.documentElement.lang = lang;
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  }

  /**
   * Load saved language preference
   */
  loadSavedLanguage() {
    try {
      const savedLang = localStorage.getItem('MiWebMusicStore_language');
      if (savedLang && ['id', 'en', 'ms'].includes(savedLang)) {
        this.currentLang = savedLang;
      } else {
        // Auto-detect browser language
        const browserLang = navigator.language.substr(0, 2);
        if (['id', 'en', 'ms'].includes(browserLang)) {
          this.currentLang = browserLang;
        }
      }
    } catch (error) {
      console.warn('Could not load language preference:', error);
      this.currentLang = 'id'; // Fallback to Indonesian
    }
  }

  /**
   * Show notification
   */
  showNotification(message) {
    // Create or update notification
    let notification = document.getElementById('lang-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'lang-notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        font-weight: 500;
      `;
      document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.transform = 'translateX(0)';

    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
    }, 3000);
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLang;
  }

  /**
   * Change language programmatically
   */
  changeLanguage(langCode) {
    const languages = {
      'id': 'Bahasa Indonesia',
      'en': 'English',
      'ms': 'Bahasa Malaysia'
    };
    
    if (languages[langCode]) {
      this.selectLanguage(langCode, languages[langCode]);
    }
  }
}

// Auto-initialize when DOM is ready
let languageSelectorInstance = null;

function initLanguageSelector() {
  console.log('🚀 Initializing Language Selector...');
  
  if (!languageSelectorInstance) {
    languageSelectorInstance = new LanguageSelector();
    window.languageSelector = languageSelectorInstance;
    console.log('✅ Language Selector instance created');
  } else {
    console.log('⚠️ Language Selector already exists');
  }
}

// Listen for DOM ready
if (document.readyState === 'loading') {
  console.log('📄 DOM loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', initLanguageSelector);
} else {
  console.log('📄 DOM already ready, initializing immediately...');
  initLanguageSelector();
}

// Also listen for components loaded
window.addEventListener('componentsLoaded', () => {
  console.log('📦 Components loaded event received');
  if (!languageSelectorInstance) {
    console.log('🔄 Retrying Language Selector initialization...');
    initLanguageSelector();
  }
});

// Export for manual initialization
export { initLanguageSelector };
