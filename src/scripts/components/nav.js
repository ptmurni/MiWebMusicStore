/**
 * Navigation Utilities
 * Handles mobile menu toggle and smooth scrolling
 */

export class NavigationUtils {
  /**
   * Initialize mobile menu functionality
   */
  static initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  /**
   * Initialize smooth scrolling for navigation links
   */
  static initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
          }
        }
      });
    });
  }

  /**
   * Initialize all navigation functionality
   */
  static init() {
    this.initMobileMenu();
    this.initSmoothScrolling();
    console.log('✅ Navigation utilities initialized');
  }
}
