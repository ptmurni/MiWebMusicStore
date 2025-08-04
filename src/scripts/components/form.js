/**
 * Form Utilities
 * Handles form validation, submission, and interactions
 */

export class FormUtils {
  /**
   * Initialize all forms
   */
  static init() {
    // Initialize contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      FormUtils.initContactForm(contactForm);
    }

    // Initialize quote forms
    const quoteForms = document.querySelectorAll('.quote-form');
    quoteForms.forEach(form => {
      FormUtils.initQuoteForm(form);
    });

    console.log('✅ Form utilities initialized');
  }

  /**
   * Initialize contact form
   * @param {HTMLElement} form - The contact form element
   */
  static initContactForm(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      if (FormUtils.validateContactForm(data)) {
        FormUtils.submitContactForm(data);
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        FormUtils.validateField(input);
      });
    });
  }

  /**
   * Initialize quote form
   * @param {HTMLElement} form - The quote form element
   */
  static initQuoteForm(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      if (FormUtils.validateQuoteForm(data)) {
        FormUtils.submitQuoteForm(data);
      }
    });
  }

  /**
   * Validate contact form
   * @param {Object} data - Form data
   * @returns {boolean} - Whether form is valid
   */
  static validateContactForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Nama harus diisi minimal 2 karakter');
    }

    if (!data.email || !FormUtils.isValidEmail(data.email)) {
      errors.push('Email tidak valid');
    }

    if (!data.phone || data.phone.trim().length < 10) {
      errors.push('Nomor telepon harus diisi minimal 10 digit');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Pesan harus diisi minimal 10 karakter');
    }

    if (errors.length > 0) {
      FormUtils.showFormErrors(errors);
      return false;
    }

    return true;
  }

  /**
   * Validate quote form
   * @param {Object} data - Form data
   * @returns {boolean} - Whether form is valid
   */
  static validateQuoteForm(data) {
    const errors = [];

    if (!data.origin || data.origin.trim().length < 2) {
      errors.push('Kota asal harus diisi');
    }

    if (!data.destination || data.destination.trim().length < 2) {
      errors.push('Kota tujuan harus diisi');
    }

    if (!data.weight || parseFloat(data.weight) <= 0) {
      errors.push('Berat paket harus lebih dari 0');
    }

    if (errors.length > 0) {
      FormUtils.showFormErrors(errors);
      return false;
    }

    return true;
  }

  /**
   * Validate individual field
   * @param {HTMLElement} field - The field to validate
   */
  static validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.type) {
      case 'email':
        isValid = FormUtils.isValidEmail(value);
        message = isValid ? '' : 'Email tidak valid';
        break;
      case 'tel':
        isValid = value.length >= 10;
        message = isValid ? '' : 'Nomor telepon minimal 10 digit';
        break;
      default:
        if (field.required) {
          isValid = value.length > 0;
          message = isValid ? '' : 'Field ini wajib diisi';
        }
    }

    FormUtils.toggleFieldError(field, !isValid, message);
    return isValid;
  }

  /**
   * Check if email is valid
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether email is valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Show form errors
   * @param {Array} errors - Array of error messages
   */
  static showFormErrors(errors) {
    // Create or update error container
    let errorContainer = document.getElementById('form-errors');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'form-errors';
      errorContainer.className = 'bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4';
    }

    errorContainer.innerHTML = `
      <div class="flex items-start">
        <iconify-icon icon="heroicons:exclamation-triangle" class="text-red-500 mr-2 mt-0.5"></iconify-icon>
        <div>
          <h4 class="font-medium">Terdapat kesalahan:</h4>
          <ul class="list-disc list-inside mt-1">
            ${errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    // Insert error container before first form
    const firstForm = document.querySelector('form');
    if (firstForm) {
      firstForm.parentNode.insertBefore(errorContainer, firstForm);
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorContainer.remove();
    }, 5000);
  }

  /**
   * Toggle field error state
   * @param {HTMLElement} field - The field element
   * @param {boolean} hasError - Whether field has error
   * @param {string} message - Error message
   */
  static toggleFieldError(field, hasError, message) {
    const errorClass = 'border-red-500';
    const successClass = 'border-green-500';

    field.classList.remove(errorClass, successClass);
    
    if (hasError) {
      field.classList.add(errorClass);
    } else if (field.value.trim()) {
      field.classList.add(successClass);
    }

    // Show/hide error message
    let errorElement = field.parentNode.querySelector('.field-error');
    if (hasError && message) {
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error text-red-500 text-sm mt-1';
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Submit contact form
   * @param {Object} data - Form data
   */
  static submitContactForm(data) {
    // Simulate form submission
    console.log('Submitting contact form:', data);
    
    // Show success message
    FormUtils.showSuccessMessage('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
    
    // Reset form
    const form = document.getElementById('contact-form');
    if (form) form.reset();
  }

  /**
   * Submit quote form
   * @param {Object} data - Form data
   */
  static submitQuoteForm(data) {
    // Simulate quote calculation
    console.log('Calculating quote:', data);
    
    // Show quote result
    const estimatedCost = FormUtils.calculateShippingCost(data);
    FormUtils.showQuoteResult(estimatedCost, data);
  }

  /**
   * Calculate shipping cost (mock calculation)
   * @param {Object} data - Form data
   * @returns {number} - Estimated cost
   */
  static calculateShippingCost(data) {
    const baseRate = 5000; // Base rate per kg
    const weight = parseFloat(data.weight) || 1;
    const distance = Math.random() * 1000 + 100; // Mock distance
    
    return Math.floor(baseRate * weight * (distance / 100));
  }

  /**
   * Show quote result
   * @param {number} cost - Estimated cost
   * @param {Object} data - Form data
   */
  static showQuoteResult(cost, data) {
    const resultContainer = document.getElementById('quote-result') || FormUtils.createQuoteResultContainer();
    
    resultContainer.innerHTML = `
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-start">
          <iconify-icon icon="heroicons:check-circle" class="text-green-500 mr-3 mt-0.5"></iconify-icon>
          <div>
            <h4 class="font-medium text-green-800">Estimasi Biaya Pengiriman</h4>
            <div class="mt-2 text-sm text-green-700">
              <p><strong>Rute:</strong> ${data.origin} → ${data.destination}</p>
              <p><strong>Berat:</strong> ${data.weight} kg</p>
              <p><strong>Estimasi Biaya:</strong> <span class="text-lg font-bold">Rp ${cost.toLocaleString('id-ID')}</span></p>
              <p class="mt-2 text-xs">*Estimasi biaya dapat berubah berdasarkan kondisi aktual</p>
            </div>
          </div>
        </div>
      </div>
    `;

    resultContainer.classList.remove('hidden');
    resultContainer.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Create quote result container
   * @returns {HTMLElement} - Quote result container
   */
  static createQuoteResultContainer() {
    const container = document.createElement('div');
    container.id = 'quote-result';
    container.className = 'mt-6';
    
    const quoteForm = document.querySelector('.quote-form');
    if (quoteForm) {
      quoteForm.parentNode.insertBefore(container, quoteForm.nextSibling);
    }
    
    return container;
  }

  /**
   * Show success message
   * @param {string} message - Success message
   */
  static showSuccessMessage(message) {
    const successContainer = document.createElement('div');
    successContainer.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successContainer.innerHTML = `
      <div class="flex items-center">
        <iconify-icon icon="heroicons:check-circle" class="mr-2"></iconify-icon>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(successContainer);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      successContainer.remove();
    }, 3000);
  }
}
