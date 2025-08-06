/**
 * Hero Component
 * Handles hero section functionality including dynamic title highlighting
 */

import LanguageManager from '../managers/LanguageManager.js';

export class HeroComponent {
  static isInitialized = false;

  /**
   * Initialize hero component
   */
  static init() {
    if (HeroComponent.isInitialized) return;

    try {
      console.log('🎯 Initializing Hero Component...');

      // Set up hero title highlighting
      HeroComponent.setupTitleHighlighting();

      // Listen for language changes
      window.addEventListener('languageManagerChanged', () => {
        HeroComponent.updateTitleHighlighting();
      });

      HeroComponent.isInitialized = true;
      console.log('✅ Hero Component initialized');

    } catch (error) {
      console.error('❌ Hero Component initialization failed:', error);
    }
  }

  /**
   * Set up title highlighting
   */
  static setupTitleHighlighting() {
    // Wait for DOM to be ready and language manager to be initialized
    const setupHighlighting = () => {
      HeroComponent.updateTitleHighlighting();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupHighlighting);
    } else {
      setupHighlighting();
    }
  }

  /**
   * Update title highlighting based on current language
   */
  static updateTitleHighlighting() {
    try {
      const titleElement = document.querySelector('.hero-title [data-translate="hero.title"]');
      if (!titleElement) return;

      const fullTitle = LanguageManager.get('hero.title');
      const highlightText = LanguageManager.get('hero.titleHighlight');

      if (fullTitle && highlightText && fullTitle.includes(highlightText)) {
        // Split the title and wrap the highlight text in a span
        const parts = fullTitle.split(highlightText);
        if (parts.length === 2) {
          titleElement.innerHTML = `${parts[0]}<span class="hero-title-brand">${highlightText}</span>${parts[1]}`;
        } else {
          titleElement.textContent = fullTitle;
        }
      } else {
        titleElement.textContent = fullTitle;
      }

      console.log('🎨 Hero title highlighting updated');

    } catch (error) {
      console.error('❌ Error updating hero title highlighting:', error);
    }
  }

  /**
   * Get component status
   */
  static getStatus() {
    return {
      initialized: HeroComponent.isInitialized,
      hasHeroSection: !!document.querySelector('.hero-section'),
      hasTitleElement: !!document.querySelector('.hero-title [data-translate="hero.title"]')
    };
  }

  /**
   * Cleanup component
   */
  static cleanup() {
    HeroComponent.isInitialized = false;
    console.log('🧹 Hero Component cleanup completed');
  }
}

// Auto-initialize when module loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HeroComponent.init());
} else {
  HeroComponent.init();
}

export default HeroComponent;
