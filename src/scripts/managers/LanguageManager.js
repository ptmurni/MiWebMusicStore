/**
 * Auto-Initializing Language Manager
 * Works independently from main.js
 */

export class LanguageManager {
  static currentLanguage = 'id';
  static translations = new Map();
  static isInitialized = false;

  /**
   * Auto-initialize when module loads
   */
  static {
    // Auto-start when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => LanguageManager.autoInit());
    } else {
      LanguageManager.autoInit();
    }
  }

  /**
   * Auto initialization
   */
  static async autoInit() {
    if (LanguageManager.isInitialized) return;
    
    try {
      console.log('🌐 Auto-initializing LanguageManager...');
      
      // Load saved language preference or use default
      const savedLang = LanguageManager.getSavedLanguage();
      LanguageManager.currentLanguage = savedLang || 'id';

      // Load translations for current language
      await LanguageManager.loadTranslations(LanguageManager.currentLanguage);

      // Set up event listeners
      LanguageManager.setupEventListeners();

      // Apply initial translations
      LanguageManager.applyTranslations();

      LanguageManager.isInitialized = true;
      console.log(`✅ LanguageManager auto-initialized with: ${LanguageManager.currentLanguage}`);

    } catch (error) {
      console.error('❌ LanguageManager auto-init failed:', error);
    }
  }

  /**
   * Load translations from JSON file
   * @param {string} language - Language code to load
   */
  static async loadTranslations(language) {
    try {
      console.log(`📚 Loading translations for: ${language}`);
      
      const response = await fetch(`/src/locales/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${language}: ${response.status}`);
      }

      const translations = await response.json();
      LanguageManager.translations.set(language, translations);
      
      console.log(`✅ Translations loaded for ${language}`);
      return translations;

    } catch (error) {
      console.error(`❌ Error loading translations for ${language}:`, error);
      
      // Fallback to Indonesian if current language fails
      if (language !== 'id') {
        console.log('🔄 Falling back to Indonesian...');
        return LanguageManager.loadTranslations('id');
      }
      
      throw error;
    }
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (e.g., 'navigation.home')
   * @param {string} fallback - Fallback text if key not found
   * @returns {string} - Translated text
   */
  static get(key, fallback = key) {
    try {
      const translations = LanguageManager.translations.get(LanguageManager.currentLanguage);
      if (!translations) {
        console.warn(`No translations loaded for ${LanguageManager.currentLanguage}`);
        return fallback;
      }

      // Split key by dots and traverse object
      const keys = key.split('.');
      let value = translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key not found: ${key}`);
          return fallback;
        }
      }

      return typeof value === 'string' ? value : fallback;

    } catch (error) {
      console.error(`Error getting translation for key: ${key}`, error);
      return fallback;
    }
  }

  /**
   * Change language
   * @param {string} language - New language code
   */
  static async setLanguage(language) {
    if (language === LanguageManager.currentLanguage) {
      console.log(`Language is already set to: ${language}`);
      return;
    }

    try {
      console.log(`🔄 Changing language to: ${language}`);

      // Load translations if not already loaded
      if (!LanguageManager.translations.has(language)) {
        await LanguageManager.loadTranslations(language);
      }

      const oldLanguage = LanguageManager.currentLanguage;
      LanguageManager.currentLanguage = language;

      // Save preference
      LanguageManager.saveLanguagePreference(language);

      // Update HTML lang attribute
      document.documentElement.lang = language;

      // Apply translations
      LanguageManager.applyTranslations();

      // Update meta tags
      LanguageManager.updateMetaTags();

      // Trigger language changed event
      window.dispatchEvent(new CustomEvent('languageManagerChanged', {
        detail: { 
          oldLanguage,
          newLanguage: language,
          translations: LanguageManager.translations.get(language)
        }
      }));

      console.log(`✅ Language changed to: ${language}`);

    } catch (error) {
      console.error(`❌ Error changing language to ${language}:`, error);
      throw error;
    }
  }

  /**
   * Apply translations to all elements with data-translate attributes
   */
  static applyTranslations() {
    try {
      console.log('🔄 Applying translations...');
      
      // Translate elements with data-translate attribute (main method)
      const translateElements = document.querySelectorAll('[data-translate]');
      translateElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = LanguageManager.get(key);
        if (translation !== key) {
          element.textContent = translation;
        }
      });

      // Translate placeholders
      const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
      placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = LanguageManager.get(key);
        if (translation !== key) {
          element.placeholder = translation;
        }
      });

      // Translate titles
      const titleElements = document.querySelectorAll('[data-translate-title]');
      titleElements.forEach(element => {
        const key = element.getAttribute('data-translate-title');
        const translation = LanguageManager.get(key);
        if (translation !== key) {
          element.title = translation;
        }
      });

      console.log('🔄 Translations applied to DOM elements');

    } catch (error) {
      console.error('❌ Error applying translations:', error);
    }
  }

  /**
   * Update meta tags based on current language
   */
  static updateMetaTags() {
    try {
      const title = LanguageManager.get('meta.title');
      const description = LanguageManager.get('meta.description');

      if (title !== 'meta.title') {
        document.title = title;
      }

      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta && description !== 'meta.description') {
        descriptionMeta.content = description;
      }

      console.log('📝 Meta tags updated');

    } catch (error) {
      console.error('❌ Error updating meta tags:', error);
    }
  }

  /**
   * Set up event listeners
   */
  static setupEventListeners() {
    // Listen for language change from language selector
    window.addEventListener('languageChanged', (event) => {
      const { language } = event.detail;
      LanguageManager.setLanguage(language);
    });

    // Listen for component updates to reapply translations
    window.addEventListener('componentsLoaded', () => {
      console.log('🔄 Components loaded, reapplying translations...');
      setTimeout(() => LanguageManager.applyTranslations(), 100);
    });

    console.log('👂 Language event listeners set up');
  }

  /**
   * Save language preference to localStorage
   * @param {string} language - Language code to save
   */
  static saveLanguagePreference(language) {
    try {
      localStorage.setItem('MiWebMusicStore_language', language);
      console.log(`💾 Language preference saved: ${language}`);
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  }

  /**
   * Get saved language preference from localStorage
   * @returns {string|null} - Saved language code or null
   */
  static getSavedLanguage() {
    try {
      const saved = localStorage.getItem('MiWebMusicStore_language');
      if (saved && ['id', 'en', 'ms'].includes(saved)) {
        return saved;
      }
      
      // Auto-detect browser language
      const browserLang = navigator.language.substr(0, 2);
      if (['id', 'en', 'ms'].includes(browserLang)) {
        return browserLang;
      }
      
      return null;
    } catch (error) {
      console.warn('Could not load language preference:', error);
      return null;
    }
  }

  /**
   * Get current language
   * @returns {string} - Current language code
   */
  static getCurrentLanguage() {
    return LanguageManager.currentLanguage;
  }

  /**
   * Get available languages
   * @returns {Array} - Array of available language codes
   */
  static getAvailableLanguages() {
    return ['id', 'en', 'ms'];
  }

  /**
   * Check if a language is available
   * @param {string} language - Language code to check
   * @returns {boolean} - Whether language is available
   */
  static isLanguageAvailable(language) {
    return LanguageManager.getAvailableLanguages().includes(language);
  }

  /**
   * Translate a specific element
   * @param {string|HTMLElement} selector - Element selector or element
   * @param {string} key - Translation key
   */
  static translateElement(selector, key) {
    try {
      const element = typeof selector === 'string' 
        ? document.querySelector(selector) 
        : selector;

      if (element) {
        const translation = LanguageManager.get(key);
        if (translation !== key) {
          element.textContent = translation;
        }
      }
    } catch (error) {
      console.error('Error translating element:', error);
    }
  }

  /**
   * Get current language data/translations
   * @returns {Object} - Current language translations object
   */
  static getCurrentLanguageData() {
    return LanguageManager.translations.get(LanguageManager.currentLanguage) || {};
  }

  /**
   * Get language name
   * @param {string} langCode - Language code
   * @returns {string} - Language name
   */
  static getLanguageName(langCode) {
    const names = {
      'id': 'Bahasa Indonesia',
      'en': 'English',
      'ms': 'Bahasa Malaysia'
    };
    return names[langCode] || langCode;
  }

  /**
   * Cleanup and reset
   */
  static cleanup() {
    LanguageManager.translations.clear();
    LanguageManager.currentLanguage = 'id';
    LanguageManager.isInitialized = false;
    console.log('🧹 LanguageManager cleanup completed');
  }

  /**
   * Get status information
   * @returns {Object} - Status information
   */
  static getStatus() {
    return {
      initialized: LanguageManager.isInitialized,
      currentLanguage: LanguageManager.currentLanguage,
      loadedLanguages: Array.from(LanguageManager.translations.keys()),
      availableLanguages: LanguageManager.getAvailableLanguages()
    };
  }
}

// Export for use in other modules
export default LanguageManager;
