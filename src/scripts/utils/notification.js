/**
 * Notification Utilities
 * Handles toast notifications, alerts, and user feedback
 */

export class NotificationUtils {
  static notifications = [];
  static nextId = 1;

  /**
   * Initialize notification system
   */
  static init() {
    // Create notification container if not exists
    NotificationUtils.createNotificationContainer();
    
    // Initialize global event delegation for notifications
    NotificationUtils.initEventDelegation();
    
    console.log('✅ Notification utilities initialized');
  }

  /**
   * Initialize global event delegation for notification buttons
   * This provides a fallback in case individual event listeners fail
   */
  static initEventDelegation() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('.notification-action-btn');
      if (target) {
        const notificationId = parseInt(target.getAttribute('data-notification-id'));
        if (notificationId) {
          NotificationUtils.handleAction(notificationId);
        }
      }

      const closeTarget = event.target.closest('.notification-close-btn');
      if (closeTarget) {
        const notificationId = parseInt(closeTarget.getAttribute('data-notification-id'));
        if (notificationId) {
          NotificationUtils.hide(notificationId);
        }
      }
    });
  }

  /**
   * Create notification container
   */
  static createNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Show success notification
   * @param {string} message - Success message
   * @param {Object} options - Notification options
   */
  static success(message, options = {}) {
    return NotificationUtils.show(message, 'success', options);
  }

  /**
   * Show error notification
   * @param {string} message - Error message
   * @param {Object} options - Notification options
   */
  static error(message, options = {}) {
    return NotificationUtils.show(message, 'error', options);
  }

  /**
   * Show warning notification
   * @param {string} message - Warning message
   * @param {Object} options - Notification options
   */
  static warning(message, options = {}) {
    return NotificationUtils.show(message, 'warning', options);
  }

  /**
   * Show info notification
   * @param {string} message - Info message
   * @param {Object} options - Notification options
   */
  static info(message, options = {}) {
    return NotificationUtils.show(message, 'info', options);
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {Object} options - Notification options
   */
  static show(message, type = 'info', options = {}) {
    const {
      duration = 5000,
      closable = true,
      persistent = false,
      title = null,
      action = null
    } = options;

    const notification = {
      id: NotificationUtils.nextId++,
      message,
      type,
      title,
      action,
      closable,
      persistent,
      timestamp: Date.now()
    };

    NotificationUtils.notifications.push(notification);
    const element = NotificationUtils.createNotificationElement(notification);
    
    const container = NotificationUtils.createNotificationContainer();
    container.appendChild(element);

    // Auto-hide if not persistent
    if (!persistent && duration > 0) {
      setTimeout(() => {
        NotificationUtils.hide(notification.id);
      }, duration);
    }

    return notification.id;
  }

  /**
   * Create notification element
   * @param {Object} notification - Notification object
   * @returns {HTMLElement} - Notification element
   */
  static createNotificationElement(notification) {
    const { id, message, type, title, action, closable } = notification;
    
    const typeConfig = {
      success: {
        bgClass: 'bg-green-500',
        icon: 'heroicons:check-circle',
        textClass: 'text-white'
      },
      error: {
        bgClass: 'bg-red-500',
        icon: 'heroicons:x-circle',
        textClass: 'text-white'
      },
      warning: {
        bgClass: 'bg-yellow-500',
        icon: 'heroicons:exclamation-triangle',
        textClass: 'text-white'
      },
      info: {
        bgClass: 'bg-blue-500',
        icon: 'heroicons:information-circle',
        textClass: 'text-white'
      }
    };

    const config = typeConfig[type] || typeConfig.info;
    
    const element = document.createElement('div');
    element.id = `notification-${id}`;
    element.className = `${config.bgClass} ${config.textClass} px-4 py-3 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 opacity-0 translate-x-full`;
    
    element.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="flex items-start">
          <iconify-icon icon="${config.icon}" class="mr-3 mt-0.5 flex-shrink-0"></iconify-icon>
          <div>
            ${title ? `<h4 class="font-medium">${title}</h4>` : ''}
            <p class="text-sm ${title ? 'mt-1' : ''}">${message}</p>
            ${action ? `<button class="mt-2 text-sm underline hover:no-underline notification-action-btn" data-notification-id="${id}">${action.text}</button>` : ''}
          </div>
        </div>
        ${closable ? `<button class="ml-4 flex-shrink-0 hover:opacity-75 notification-close-btn" data-notification-id="${id}"><iconify-icon icon="heroicons:x-mark"></iconify-icon></button>` : ''}
      </div>
    `;

    // Trigger animation after element is added to DOM
    setTimeout(() => {
      element.classList.remove('opacity-0', 'translate-x-full');
    }, 10);

    // Add event listeners for buttons
    const actionBtn = element.querySelector('.notification-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        NotificationUtils.handleAction(id);
      });
    }

    const closeBtn = element.querySelector('.notification-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        NotificationUtils.hide(id);
      });
    }

    return element;
  }

  /**
   * Hide notification
   * @param {number} id - Notification ID
   */
  static hide(id) {
    const element = document.getElementById(`notification-${id}`);
    if (element) {
      element.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => {
        element.remove();
      }, 300);
    }

    // Remove from notifications array
    NotificationUtils.notifications = NotificationUtils.notifications.filter(n => n.id !== id);
  }

  /**
   * Handle notification action
   * @param {number} id - Notification ID
   */
  static handleAction(id) {
    const notification = NotificationUtils.notifications.find(n => n.id === id);
    if (notification && notification.action && notification.action.callback) {
      notification.action.callback();
    }
    NotificationUtils.hide(id);
  }

  /**
   * Clear all notifications
   */
  static clearAll() {
    const container = document.getElementById('notification-container');
    if (container) {
      container.innerHTML = '';
    }
    NotificationUtils.notifications = [];
  }

  /**
   * Show loading notification
   * @param {string} message - Loading message
   * @returns {number} - Notification ID
   */
  static loading(message = 'Loading...') {
    const element = document.createElement('div');
    element.className = 'bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm flex items-center';
    element.innerHTML = `
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
      <span>${message}</span>
    `;

    const container = NotificationUtils.createNotificationContainer();
    container.appendChild(element);

    return element;
  }

  /**
   * Hide loading notification
   * @param {HTMLElement} loadingElement - Loading element to hide
   */
  static hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
      loadingElement.remove();
    }
  }

  /**
   * Show confirmation dialog
   * @param {string} message - Confirmation message
   * @param {Object} options - Dialog options
   * @returns {Promise<boolean>} - User confirmation
   */
  static confirm(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Konfirmasi',
        confirmText = 'Ya',
        cancelText = 'Batal',
        type = 'warning'
      } = options;

      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
      
      overlay.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-4 transform transition-all">
          <div class="flex items-start">
            <iconify-icon icon="heroicons:exclamation-triangle" class="text-yellow-500 mr-3 mt-1"></iconify-icon>
            <div>
              <h3 class="text-lg font-medium text-gray-900">${title}</h3>
              <p class="mt-2 text-gray-600">${message}</p>
            </div>
          </div>
          <div class="mt-6 flex space-x-3 justify-end">
            <button id="cancel-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">${cancelText}</button>
            <button id="confirm-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">${confirmText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Handle buttons
      overlay.querySelector('#confirm-btn').addEventListener('click', () => {
        overlay.remove();
        resolve(true);
      });

      overlay.querySelector('#cancel-btn').addEventListener('click', () => {
        overlay.remove();
        resolve(false);
      });

      // Handle overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
          resolve(false);
        }
      });

      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', handleEscape);
          overlay.remove();
          resolve(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  }

  /**
   * Show alert dialog
   * @param {string} message - Alert message
   * @param {Object} options - Dialog options
   * @returns {Promise<void>} - Dialog closed
   */
  static alert(message, options = {}) {
    return new Promise((resolve) => {
      const {
        title = 'Peringatan',
        buttonText = 'OK',
        type = 'info'
      } = options;

      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
      
      overlay.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md mx-4">
          <div class="flex items-start">
            <iconify-icon icon="heroicons:information-circle" class="text-blue-500 mr-3 mt-1"></iconify-icon>
            <div>
              <h3 class="text-lg font-medium text-gray-900">${title}</h3>
              <p class="mt-2 text-gray-600">${message}</p>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button id="ok-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">${buttonText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Handle button
      overlay.querySelector('#ok-btn').addEventListener('click', () => {
        overlay.remove();
        resolve();
      });

      // Handle overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
          resolve();
        }
      });
    });
  }
}
