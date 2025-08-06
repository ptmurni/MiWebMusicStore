import '../styles/main.css';
import 'iconify-icon';

// Import all utility modules
import { NavigationUtils } from './components/nav.js';
import { IconifyUtils } from './utils/iconify.js';
import { FormUtils } from './components/form.js';
import { NotificationUtils } from './utils/notification.js';
import { TrackingUtils } from './utils/tracking.js';
import { StatsCounter } from './components/counter.js';
import { AnimationUtils } from './components/animation.js';
import { ComponentManager } from './components/component.js';
import { HeroComponent } from './components/hero.js';
import { initCatalogQuickViewModal } from './components/catalog-quickview-modal.js'; 
// import { initQuickViewModal } from './components/products-quickview-modal.js'; 

// Main application class
class MiWebMusicStore {
  static isInitialized = false;

  /**
   * Initialize the application
   */
  static async init() {
    if (MiWebMusicStore.isInitialized) {
      console.warn('Application already initialized');
      return;
    }

    console.log('🚀 Initializing MiWebMusicStore application...');

    try {
      // Initialize component system first
      await ComponentManager.init();
      
      // Initialize utilities after components are loaded
      await MiWebMusicStore.initializeUtilities();

      // Mark as initialized
      MiWebMusicStore.isInitialized = true;

      console.log('✅ MiWebMusicStore application initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing application:', error);
      NotificationUtils.error('Terjadi kesalahan saat memuat aplikasi. Silakan refresh halaman.');
    }
  }

  /**
   * Initialize all utility modules
   */
  static async initializeUtilities() {
    try {
      // Initialize core utilities first
      IconifyUtils.init();
      NotificationUtils.init();
      
      // Wait a bit for DOM to settle then initialize UI utilities
      setTimeout(() => {
        NavigationUtils.init();
        FormUtils.init();
        TrackingUtils.init();
        
        // Initialize component utilities
        HeroComponent.init();
        
        // Initialize quickview modals
        // initQuickViewModal(); // For products.html
        initCatalogQuickViewModal(); // For productsCatalogue.html
        
        // Initialize animation utilities
        AnimationUtils.init();
        StatsCounter.init();

        console.log('📦 All utilities initialized successfully');
        
        // Show success notification
        NotificationUtils.success('MiWebMusicStore Template berhasil dimuat!');
      }, 200);

    } catch (error) {
      console.error('❌ Error initializing utilities:', error);
      NotificationUtils.error('Terjadi kesalahan saat memuat template. Silakan refresh halaman.');
    }
  }

  /**
   * Cleanup all utilities
   */
  static cleanup() {
    try {
      IconifyUtils.cleanup();
      AnimationUtils.cleanup();
      NotificationUtils.clearAll();
      
      MiWebMusicStore.isInitialized = false;
      console.log('🧹 Application cleanup completed');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }

  /**
   * Get application status
   */
  static getStatus() {
    return {
      initialized: MiWebMusicStore.isInitialized,
      iconStats: IconifyUtils.getUsageStats(),
      animations: AnimationUtils.animatedElements?.size || 0,
      notifications: NotificationUtils.notifications.length
    };
  }

  /**
   * Reinitialize application (useful for dynamic content)
   */
  static reinitialize() {
    console.log('🔄 Reinitializing application...');
    MiWebMusicStore.cleanup();
    setTimeout(() => {
      MiWebMusicStore.init();
    }, 100);
  }

  /**
   * Reinitialize utilities after component changes
   */
  static reinitializeUtilities() {
    console.log('🔄 Reinitializing utilities for new components...');
    setTimeout(() => {
      // Reinitialize iconify for new elements
      IconifyUtils.processAllIcons();
      
      // Reinitialize other utilities
      NavigationUtils.init();
      FormUtils.init();
      TrackingUtils.init();
      HeroComponent.init();
      AnimationUtils.init();
      StatsCounter.init();
    }, 500);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    MiWebMusicStore.init();
  });
} else {
  // DOM is already loaded
  MiWebMusicStore.init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('📱 Page hidden - pausing non-essential operations');
  } else {
    console.log('📱 Page visible - resuming operations');
    // Reinitialize icons if needed
    if (IconifyUtils.processAllIcons) {
      IconifyUtils.processAllIcons();
    }
  }
});

// Handle window resize
window.addEventListener('resize', AnimationUtils.throttle(() => {
  console.log('📐 Window resized - updating layouts');
  // Could trigger layout updates here
}, 250));

// Global error handler
window.addEventListener('error', (event) => {
  console.error('💥 Global error:', event.error);
  if (NotificationUtils.error) {
    NotificationUtils.error('Terjadi kesalahan. Tim teknis kami akan segera memperbaikinya.');
  }
});

// Listen for dynamic component updates
window.addEventListener('componentUpdated', () => {
  console.log('🔄 Component updated, reinitializing utilities...');
  MiWebMusicStore.reinitializeUtilities();
});

// Listen for when all components are loaded
window.addEventListener('componentsLoaded', () => {
  console.log('🎉 All components loaded, reinitializing utilities...');
  MiWebMusicStore.reinitializeUtilities();
});

// Listen for individual component renders
window.addEventListener('componentRendered', (event) => {
  const { componentName } = event.detail;
  if (componentName === 'stats') {
    console.log('📊 Stats component rendered, initializing counters...');
    setTimeout(() => {
      StatsCounter.init();
    }, 100);
  }
});

// Also listen for when a specific component gets loaded
window.addEventListener('componentsLoaded', () => {
  console.log('🎉 All components loaded, ensuring stats counters are initialized...');
  // Extra delay to ensure stats component is fully rendered
  setTimeout(() => {
    console.log('🔄 Re-checking stats counters after component load...');
    StatsCounter.init();
  }, 500);
});

// Expose MiWebMusicStore to global scope for debugging
window.MiWebMusicStore = MiWebMusicStore;

// Export for ES modules
export default MiWebMusicStore;

