// src/scripts/managers/VariantManager.js
import { 
  variantConfig, 
  getVariantInspiration, 
  generateCSSVariables, 
  getPlesetanInfo 
} from '../configs/variant.config.js';

export class VariantManager {
  constructor() {
    this.currentVariant = this.loadSavedVariant() || variantConfig.defaultVariant;
    this.listeners = [];
    this.init();
  }
  
  init() {
    // Apply variant on initialization
    this.applyVariant(this.currentVariant);
    
    // Listen for component loaded event
    window.addEventListener('componentsLoaded', () => {
      this.refreshVariant();
    });
  }
  
  loadSavedVariant() {
    const savedVariant = localStorage.getItem('selectedVariant');
    // Check if saved variant exists in current config
    if (savedVariant && variantConfig.variants[savedVariant]) {
      return savedVariant;
    }
    // If saved variant doesn't exist, clear it and return null
    if (savedVariant) {
      console.warn(`⚠️ Saved variant "${savedVariant}" not found in config, resetting to default`);
      localStorage.removeItem('selectedVariant');
    }
    return null;
  }
  
  saveVariant(variantName) {
    localStorage.setItem('selectedVariant', variantName);
  }
  
  applyVariant(variantName) {
    const variant = variantConfig.variants[variantName];
    if (!variant) {
      console.error(`❌ Variant "${variantName}" not found. Available variants:`, Object.keys(variantConfig.variants));
      // Fallback to default variant
      const defaultVariant = variantConfig.defaultVariant;
      if (variantConfig.variants[defaultVariant]) {
        console.log(`🔄 Falling back to default variant: ${defaultVariant}`);
        this.applyVariant(defaultVariant);
      }
      return;
    }
    
    // Apply CSS variables to root using helper
    const root = document.documentElement;
    // Remove all previous color variables (optional, for clean slate)
    // Object.keys(variant.colors).forEach(key => {
    //   root.style.removeProperty(`--color-${this.camelToKebab(key)}`);
    // });
    Object.entries(variant.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.camelToKebab(key)}`, value);
    });

    // Update body class: remove all variant-* classes, add current
    document.body.className = document.body.className
      .replace(/\bvariant-\w+\b/g, '')
      .trim();
    document.body.classList.add(`variant-${variantName}`);

    // Optionally, set data-variant attribute for easier CSS targeting
    document.body.setAttribute('data-variant', variantName);

    this.currentVariant = variantName;
    this.saveVariant(variantName);
    
    // Notify listeners
    this.notifyListeners(variantName);
  }
  
  camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
  
  setVariant(variantName) {
    if (variantConfig.variants[variantName]) {
      this.applyVariant(variantName);
    }
  }
  
  getVariant() {
    return this.currentVariant;
  }
  
  getVariantConfig() {
    return variantConfig.variants[this.currentVariant];
  }

  // New: Get genre inspiration info for current or specific variant
  getVariantInspiration(variantName = this.currentVariant) {
    return getVariantInspiration(variantName);
  }

  // New: Get CSS variables string for current or specific variant
  getVariantCSSVariables(variantName = this.currentVariant) {
    return generateCSSVariables(variantName);
  }

  // New: Get plesetan info for current or specific variant
  getVariantPlesetan(variantName = this.currentVariant) {
    return getPlesetanInfo(variantName);
  }
  
  getAllVariants() {
    return Object.keys(variantConfig.variants).map(key => ({
      id: key,
      ...variantConfig.variants[key],
      inspiration: this.getVariantInspiration(key),
      plesetan: this.getVariantPlesetan(key)
    }));
  }
  
  refreshVariant() {
    this.applyVariant(this.currentVariant);
  }
  
  onVariantChange(callback) {
    this.listeners.push(callback);
  }
  
  notifyListeners(variantName) {
    this.listeners.forEach(callback => callback(variantName));
  }
}

// Create singleton instance
export const variantManager = new VariantManager();
