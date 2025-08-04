/**
 * Package Tracking Utilities
 * Handles package tracking functionality
 */

export class TrackingUtils {
  /**
   * Initialize package tracking functionality
   */
  static init() {
    const trackBtn = document.getElementById('track-btn');
    const resiInput = document.getElementById('resi-input');
    const trackingResult = document.getElementById('tracking-result');

    if (trackBtn && resiInput && trackingResult) {
      // Handle track button click
      trackBtn.addEventListener('click', function() {
        const resiValue = resiInput.value.trim();
        if (resiValue) {
          TrackingUtils.showTrackingResult();
        }
      });

      // Handle enter key press in input
      resiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          trackBtn.click();
        }
      });

      console.log('✅ Tracking utilities initialized');
    }
  }

  /**
   * Show tracking result
   */
  static showTrackingResult() {
    const trackingResult = document.getElementById('tracking-result');
    if (trackingResult) {
      trackingResult.classList.remove('hidden');
      // Simulate tracking result
      setTimeout(() => {
        trackingResult.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  /**
   * Validate resi number format
   * @param {string} resi - The resi number to validate
   * @returns {boolean} - Whether the resi is valid
   */
  static validateResi(resi) {
    // Basic validation - can be enhanced
    return resi && resi.length >= 8 && /^[A-Z0-9]+$/i.test(resi);
  }

  /**
   * Format resi number display
   * @param {string} resi - The resi number to format
   * @returns {string} - Formatted resi number
   */
  static formatResi(resi) {
    return resi.toUpperCase().replace(/(.{3})/g, '$1 ').trim();
  }
}
