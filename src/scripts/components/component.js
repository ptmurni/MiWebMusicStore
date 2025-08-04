/**
 * Component Manager
 * Handles loading, caching, and management of HTML components
 */

export class ComponentManager {
  static cache = new Map();
  static loadPromises = new Map();

  /**
   * Load component from file
   * @param {string} componentName - Name of the component file (without .html)
   * @param {boolean} useCache - Whether to use cached version
   * @returns {Promise<string>} - Component HTML content
   */
  static async loadComponent(componentName, useCache = true) {
    // Return cached version if available
    if (useCache && ComponentManager.cache.has(componentName)) {
      console.log(`📦 Loading ${componentName} from cache`);
      return ComponentManager.cache.get(componentName);
    }

    // Return existing promise if component is being loaded
    if (ComponentManager.loadPromises.has(componentName)) {
      console.log(`⏳ Waiting for ${componentName} to finish loading`);
      return ComponentManager.loadPromises.get(componentName);
    }

    // Create loading promise
    const loadPromise = ComponentManager.fetchComponent(componentName);
    ComponentManager.loadPromises.set(componentName, loadPromise);

    try {
      const html = await loadPromise;
      
      // Cache the result
      ComponentManager.cache.set(componentName, html);
      console.log(`✅ Component ${componentName} loaded and cached`);
      
      return html;
    } catch (error) {
      console.error(`❌ Error loading component ${componentName}:`, error);
      throw error;
    } finally {
      // Remove from loading promises
      ComponentManager.loadPromises.delete(componentName);
    }
  }

  /**
   * Fetch component from server
   * @param {string} componentName - Name of the component
   * @returns {Promise<string>} - Component HTML content
   */
  static async fetchComponent(componentName) {
    const response = await fetch(`/src/components/${componentName}.html`);
    
    if (!response.ok) {
      throw new Error(`Failed to load component ${componentName}: ${response.status} ${response.statusText}`);
    }
    
    return response.text();
  }

  /**
   * Render component to container
   * @param {string} componentName - Name of the component
   * @param {string|HTMLElement} container - Container selector or element
   * @param {boolean} useCache - Whether to use cached version
   * @returns {Promise<void>}
   */
  static async renderComponent(componentName, container, useCache = true) {
    try {
      const html = await ComponentManager.loadComponent(componentName, useCache);
      
      const containerElement = typeof container === 'string' 
        ? document.querySelector(container) 
        : container;

      if (!containerElement) {
        throw new Error(`Container not found: ${container}`);
      }

      containerElement.innerHTML = html;
      console.log(`🎨 Component ${componentName} rendered to container`);

      // Trigger component rendered event
      window.dispatchEvent(new CustomEvent('componentRendered', {
        detail: { componentName, container: containerElement }
      }));

    } catch (error) {
      console.error(`❌ Error rendering component ${componentName}:`, error);
      throw error;
    }
  }

  /**
   * Load and render multiple components
   * @param {Array} components - Array of {name, container} objects
   * @param {boolean} parallel - Whether to load in parallel or sequential
   * @returns {Promise<void>}
   */
  static async renderComponents(components, parallel = true) {
    console.log(`🔧 Loading ${components.length} components...`);

    if (parallel) {
      // Load all components in parallel
      const promises = components.map(({ name, container }) => 
        ComponentManager.renderComponent(name, container)
      );
      
      await Promise.all(promises);
    } else {
      // Load components sequentially
      for (const { name, container } of components) {
        await ComponentManager.renderComponent(name, container);
      }
    }

    console.log('✅ All components loaded successfully');
    
    // Trigger all components loaded event
    window.dispatchEvent(new CustomEvent('componentsLoaded'));
  }

  /**
   * Preload components
   * @param {Array<string>} componentNames - Array of component names to preload
   * @returns {Promise<void>}
   */
  static async preloadComponents(componentNames) {
    console.log(`⚡ Preloading ${componentNames.length} components...`);
    
    const promises = componentNames.map(name => 
      ComponentManager.loadComponent(name, false)
    );
    
    await Promise.all(promises);
    console.log('✅ All components preloaded');
  }

  /**
   * Clear component cache
   * @param {string} componentName - Specific component to clear (optional)
   */
  static clearCache(componentName = null) {
    if (componentName) {
      ComponentManager.cache.delete(componentName);
      console.log(`🗑️ Cache cleared for component: ${componentName}`);
    } else {
      ComponentManager.cache.clear();
      console.log('🗑️ All component cache cleared');
    }
  }

  /**
   * Reload component (force refresh from server)
   * @param {string} componentName - Name of the component
   * @param {string|HTMLElement} container - Container to render to
   * @returns {Promise<void>}
   */
  static async reloadComponent(componentName, container) {
    // Clear cache for this component
    ComponentManager.clearCache(componentName);
    
    // Reload and render
    await ComponentManager.renderComponent(componentName, container, false);
    
    console.log(`🔄 Component ${componentName} reloaded`);
  }

  /**
   * Get cache status
   * @returns {Object} - Cache information
   */
  static getCacheStatus() {
    return {
      cachedComponents: Array.from(ComponentManager.cache.keys()),
      cacheSize: ComponentManager.cache.size,
      loadingComponents: Array.from(ComponentManager.loadPromises.keys())
    };
  }

  /**
   * Check if component exists
   * @param {string} componentName - Name of the component
   * @returns {Promise<boolean>} - Whether component exists
   */
  static async componentExists(componentName) {
    try {
      const response = await fetch(`/src/components/${componentName}.html`, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Initialize component system with default components
   * NOTE: Disabled to avoid conflict with manual loading in index.html
   * Standalone components (HeaderOffCanvas, LanguageSelector, VariantSelector) are loaded separately
   */
  static async init() {
    console.log('🔧 ComponentManager: Initialization skipped - using manual loading system');
    console.log('ℹ️ Components are loaded via the manual system in index.html');
    console.log('ℹ️ Standalone components: HeaderOffCanvas, LanguageSelector, VariantSelector');
    
    // Just log that the system is available for manual use
    console.log('✅ ComponentManager utilities available for manual component loading');
    
    // Trigger initialization complete event for any listeners
    window.dispatchEvent(new CustomEvent('componentManagerReady'));
    
    return Promise.resolve();
  }

  /**
   * Initialize with manual component list (alternative init method)
   * Use this when you want to manually specify which components to load
   * @param {Array} components - Array of {name, container} objects
   */
  static async initManual(components) {
    console.log(`🔧 ComponentManager: Manual initialization with ${components.length} components`);
    
    try {
      await ComponentManager.renderComponents(components, true);
      console.log('🎉 Manual component system initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing manual component system:', error);
      throw error;
    }
  }

  /**
   * Load single component manually (for dynamic loading)
   * @param {string} componentName - Name of the component
   * @param {string} containerId - ID of the container (without #)
   */
  static async loadSingle(componentName, containerId) {
    const container = `#${containerId}`;
    try {
      await ComponentManager.renderComponent(componentName, container);
      console.log(`✅ Single component ${componentName} loaded to ${container}`);
    } catch (error) {
      console.error(`❌ Error loading single component ${componentName}:`, error);
      throw error;
    }
  }

  /**
   * Hot reload component (for development)
   * @param {string} componentName - Name of the component
   */
  static async hotReload(componentName) {
    const containers = document.querySelectorAll(`[data-component="${componentName}"]`);
    
    for (const container of containers) {
      await ComponentManager.reloadComponent(componentName, container);
    }
    
    // Trigger component update event
    window.dispatchEvent(new CustomEvent('componentUpdated', {
      detail: { componentName }
    }));
  }
}
