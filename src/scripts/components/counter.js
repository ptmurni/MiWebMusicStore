/**
 * Stats Counter Animation Utilities
 * Handles number counter animations for stats section
 */

export class StatsCounter {
  /**
   * Initialize all stat counters
   */
  static init() {
    console.log('🔢 StatsCounter.init() called');
    
    // Counter for statistics
    const counters = document.querySelectorAll('.stat-number[data-counter]');
    
    console.log(`🔍 Found ${counters.length} counter elements with selector '.stat-number[data-counter]'`);
    
    if (counters.length === 0) {
      console.log('⚠️ No stat counter elements found');
      // Let's also check if the stats section exists at all
      const statsSection = document.querySelector('.stats-section');
      console.log('Stats section exists:', !!statsSection);
      if (statsSection) {
        console.log('Stats section HTML:', statsSection.innerHTML.substring(0, 200));
      }
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
          console.log('📊 Starting stats counter animation');
          
          // Mark section as animated to prevent re-animation
          entry.target.setAttribute('data-animated', 'true');
          
          // Find all counters in the stats section
          const sectionCounters = entry.target.querySelectorAll('.stat-number[data-counter]');
          
          // Animate each counter with staggered delay
          sectionCounters.forEach((counter, index) => {
            setTimeout(() => {
              console.log('🔢 Animating counter:', counter.getAttribute('data-counter'));
              StatsCounter.animateCounter(counter);
            }, index * 150); // 150ms delay between each counter
          });
          
          // Add animation class to stat items
          const statItems = entry.target.querySelectorAll('.stat-item');
          statItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate-in');
            }, index * 100);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3, // Trigger when 30% of the element is visible
      rootMargin: '0px 0px -100px 0px' // Trigger a bit before the element is fully visible
    });

    // Observe the stats section instead of individual counters
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
      console.log('✅ Stats section observer initialized');
    }

    console.log(`✅ Stats counter utilities initialized (${counters.length} counters found)`);
  }

  /**
   * Animate counter from 0 to target value
   * @param {HTMLElement} element - The counter element
   */
  static animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const duration = parseInt(element.getAttribute('data-duration')) || 2000;
    const suffix = element.getAttribute('data-suffix') || '';
    
    if (isNaN(target)) {
      console.error('❌ Invalid counter target value:', element.getAttribute('data-counter'));
      return;
    }

    console.log(`🔢 Animating counter to ${target} over ${duration}ms`);
    
    const startTime = performance.now();
    let current = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smoother animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(target * easeOut);
      
      element.textContent = StatsCounter.formatNumber(current) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure we end with the exact target value
        element.textContent = StatsCounter.formatNumber(target) + suffix;
        console.log(`✅ Counter animation completed: ${target}`);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Format number with thousand separator
   * @param {number} num - The number to format
   * @returns {string} - Formatted number
   */
  static formatNumber(num) {
    // Use Indonesian locale for thousand separator
    return num.toLocaleString('id-ID');
  }

  /**
   * Set counter value manually
   * @param {HTMLElement} element - The counter element
   * @param {number} value - The new value
   */
  static setCounterValue(element, value) {
    const suffix = element.getAttribute('data-suffix') || '';
    element.setAttribute('data-counter', value);
    element.textContent = StatsCounter.formatNumber(value) + suffix;
  }

  /**
   * Reset all counters
   */
  static resetAllCounters() {
    const counters = document.querySelectorAll('.stat-number[data-counter]');
    counters.forEach(counter => {
      counter.textContent = '0';
      counter.removeAttribute('data-animated');
    });
    console.log(`🔄 Reset ${counters.length} stat counters`);
  }

  /**
   * Force initialize counters (for manual triggering)
   */
  static forceInit() {
    console.log('🔧 Force initializing stat counters...');
    const counters = document.querySelectorAll('.stat-number[data-counter]');
    
    counters.forEach(counter => {
      // Remove animated attribute to allow re-animation
      counter.removeAttribute('data-animated');
    });
    
    // Re-initialize
    StatsCounter.init();
    
    console.log(`🔧 Force initialized ${counters.length} stat counters`);
  }

  /**
   * Check if stats are in viewport
   * @returns {boolean} - True if stats section is visible
   */
  static isInViewport() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return false;

    const rect = statsSection.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

// Auto-initialize when DOM is ready (only if not already initialized by main.js)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 DOM loaded, checking if StatsCounter needs initialization...');
    // Small delay to let main.js initialize first
    setTimeout(() => {
      const counters = document.querySelectorAll('.stat-number[data-counter]');
      if (counters.length > 0 && !document.querySelector('.stats-section[data-animated]')) {
        console.log('📊 Auto-initializing StatsCounter...');
        StatsCounter.init();
      }
    }, 300);
  });
} else {
  // DOM already loaded, check if we need to initialize
  setTimeout(() => {
    const counters = document.querySelectorAll('.stat-number[data-counter]');
    if (counters.length > 0 && !document.querySelector('.stats-section[data-animated]')) {
      console.log('📊 Auto-initializing StatsCounter...');
      StatsCounter.init();
    }
  }, 300);
}

// Also initialize when components are loaded (for dynamic loading)
window.addEventListener('componentsLoaded', () => {
  console.log('📊 Components loaded, checking StatsCounter...');
  // Small delay to ensure DOM is fully updated
  setTimeout(() => {
    StatsCounter.init();
  }, 100);
});

// Expose StatsCounter to window for debugging
window.StatsCounter = StatsCounter;

// Export for use in other modules
export default StatsCounter;
