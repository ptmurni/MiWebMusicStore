# MiWebMusicStore 🚚

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](package.json)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#license)
[![Powered by Vite](https://img.shields.io/badge/powered%20by-Vite-646CFF.svg)](https://vitejs.dev/)
[![Styled with TailwindCSS](https://img.shields.io/badge/styled%20with-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)

> **Solusi Website Logistik Modern dengan Multi-Tema, Multi-Bahasa, dan Architecture Component-Based**

MiWebMusicStore adalah template website logistik yang menggabungkan desain modern, performa tinggi, dan fleksibilitas maksimal. Dibangun dengan teknologi terdepan dan dilengkapi sistem tema dinamis yang terinspirasi dari perusahaan logistik ternama dunia, plus sistem component yang fully modular.

## ✨ New Features & Highlights

- 🎨 **8 Tema Unik** - Terinspirasi dari perusahaan logistik global (FedEx, DHL, UPS, dll.)
- 🌍 **Multi-Bahasa** - Support Indonesia, English, dan Bahasa Malaysia
- 📱 **Responsive Design** - Perfect di semua device
- ⚡ **Lightning Fast** - Dibangun dengan Vite untuk performa optimal
- 🧩 **Modular Components** - Komponen yang dapat digunakan kembali
- 🔄 **Dynamic Loading** - Lazy loading untuk performa terbaik
- 📄 **Multiple Page Layouts** - Homepage, Single Page, dan Sidebar Layout
- 🎯 **Advanced Counter Animations** - Smooth counting animations dengan IntersectionObserver
- 📊 **Enhanced Stats Section** - Real-time statistics dengan animasi
- 📋 **Breadcrumb Navigation** - Professional navigation system
- 🎭 **Off-Canvas Header** - Modern mobile-first navigation
- 🏗️ **Component Manager** - Advanced component loading and caching system

## 🎨 Tema & Inspirasi

| Tema | Inspirasi | Warna Utama | Preview |
|------|-----------|-------------|---------|
| **Express Purple** | FedEx | Purple & Orange | Ungu dominan dengan aksen orange |
| **Express Yellow** | DHL | Yellow & Red | Kuning cerah dengan aksen merah |
| **Shield Brown** | UPS | Brown & Gold | Coklat elegan dengan aksen emas |
| **Dynamic Orange** | TNT | Orange & Blue | Orange energik dengan biru |
| **Sky Express** | Blue Dart | Blue & Red | Biru langit dengan merah |
| **Jet Red** | J&T | Red & Black | Merah jet dengan hitam |
| **Prime Orange** | Amazon | Orange & Blue | Orange prime dengan biru |
| **Nusantara Post** | Pos Indonesia | Orange & Blue | Orange nusantara 🇮🇩 |

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/MiWeb-Co-Id/MiWebMusicStore.git
cd MiWebMusicStore

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Struktur Project

```
MiWebMusicStore/
├── 📁 src/
│   ├── 📁 assets/          # Gambar, font, dan asset lainnya
│   │   ├── 📁 fonts/       # Font files
│   │   ├── 📁 icons/       # Icon assets
│   │   └── 📁 img/         # Images
│   ├── 📁 components/      # Komponen HTML
│   │   ├── about.html      # About section
│   │   ├── breadcrumb.html # Breadcrumb navigation
│   │   ├── contact.html    # Contact form
│   │   ├── content-area.html         # Content area basic
│   │   ├── content-area-sidebar.html # Content area with sidebar
│   │   ├── cta.html        # Call-to-action section
│   │   ├── features-strip.html # Features section
│   │   ├── footer.html     # Footer section
│   │   ├── header.html     # Standard header
│   │   ├── headerOffCanvas.html # Off-canvas header
│   │   ├── hero.html       # Hero section
│   │   ├── heroOneImage.html # Hero with single image
│   │   ├── language-selector.html # Language switcher
│   │   ├── services.html   # Services section
│   │   ├── stats.html      # Statistics with counters
│   │   ├── tracking.html   # Package tracking (in development)
│   │   ├── variant-selector.html # Theme switcher
│   │   └── tailwindutilitiesBase(BACKUP)/ # Backup files
│   ├── 📁 scripts/         # JavaScript modules
│   │   ├── 📁 components/  # Component logic
│   │   │   ├── animation.js      # Animation utilities
│   │   │   ├── component.js      # Component manager
│   │   │   ├── counter.js        # Counter animations
│   │   │   ├── form.js           # Form handling
│   │   │   ├── headerOffCanvas.js # Off-canvas logic
│   │   │   ├── LanguageSelector.js # Language switcher
│   │   │   ├── nav.js            # Navigation utilities
│   │   │   └── VariantSelector.js  # Theme switcher
│   │   ├── 📁 managers/    # System managers
│   │   │   ├── LanguageManager.js # Multi-language system
│   │   │   └── VariantManager.js  # Theme management
│   │   ├── 📁 configs/     # Configuration files
│   │   │   ├── component.config.js # Component settings
│   │   │   ├── language.config.js  # Language settings
│   │   │   └── variant.config.js   # Theme configurations
│   │   ├── 📁 utils/       # Utility functions
│   │   │   ├── dom.js            # DOM utilities
│   │   │   ├── http.js           # HTTP utilities
│   │   │   ├── iconify.js        # Icon management
│   │   │   ├── notification.js   # Notification system
│   │   │   ├── storage.js        # LocalStorage utilities
│   │   │   └── tracking.js       # Analytics utilities
│   │   └── main.js         # Main application entry
│   ├── 📁 styles/          # CSS/Stylesheet
│   │   ├── 📁 base/        # Base styles
│   │   ├── 📁 components/  # Component styles
│   │   ├── 📁 layouts/     # Layout styles
│   │   └── 📁 utilities/   # Utility classes
│   └── 📁 locales/         # Multi-language files
│       ├── id.json         # Bahasa Indonesia
│       ├── en.json         # English
│       └── ms.json         # Bahasa Malaysia
├── 📁 docs/                # Dokumentasi
├── index.html              # Homepage layout
├── single-page.html        # Single page layout
├── single-page-sidebar.html # Sidebar layout
├── package.json
└── README.md
```

## 📄 Page Layouts

### Homepage Layout (`index.html`)
Layout homepage lengkap dengan semua section:
- Header dengan navigation
- Hero section dengan CTA
- Features strip
- Services section
- Statistics dengan counter animation
- About section
- Call-to-Action section
- Contact form
- Footer

### Single Page Layout (`single-page.html`)
Layout untuk halaman konten dengan:
- Header off-canvas navigation
- Breadcrumb navigation
- Content area yang dapat dikustomisasi
- Footer

### Sidebar Layout (`single-page-sidebar.html`)
Layout dengan sidebar untuk artikel/blog:
- Header off-canvas navigation
- Breadcrumb navigation
- Content area dengan sidebar
- Footer

## 🎯 Fitur Utama

### 🎨 Dynamic Theme System
- **8 tema unik** dengan skema warna berbeda
- **Real-time theme switching** tanpa reload
- **Persistent theme** tersimpan di localStorage
- **CSS Custom Properties** untuk konsistensi

### 🌍 Multi-Language Support
- **3 bahasa**: Indonesia, English, Bahasa Malaysia
- **Dynamic translation** tanpa reload halaman
- **SEO-friendly** dengan meta tag localization
- **Auto-detect** browser language

### 📱 Responsive & Modern UI
- **Mobile-first** design approach
- **Touch-friendly** interface
- **Smooth animations** dan transisi
- **Accessibility** compliant

### ⚡ Performance Optimized
- **Vite build system** untuk bundling cepat
- **Lazy loading** komponen
- **Code splitting** otomatis
- **Optimized assets** dan gambar
- **IntersectionObserver** untuk efficient animations
- **Component caching** untuk performa loading

### 🧩 Modular Architecture
- **Component-based** development
- **Reusable modules** dan utilities
- **Event-driven** communication
- **Easy maintenance** dan extension
- **Dynamic component loading** dengan caching
- **Hot reload** support untuk development

### 🎭 Advanced UI Components
- **Off-canvas navigation** untuk mobile
- **Breadcrumb system** untuk navigation
- **Counter animations** dengan smooth easing
- **Form validation** dan handling
- **Notification system** untuk user feedback
- **Multi-layout** support (Homepage, Single Page, Sidebar)

## 🔧 Kustomisasi

### Mengganti Tema Default

```javascript
// src/scripts/configs/variant.config.js
export const variantConfig = {
  defaultVariant: 'skyarrow', // Ganti tema default
  variants: {
    // Definisi tema...
  }
};
```

### Menambah Bahasa Baru

1. Buat file JSON di `src/locales/`:
```json
// src/locales/fr.json (contoh: French)
{
  "meta": {
    "title": "MiWebMusicStore - Solution Logistique Fiable",
    "description": "Partenaire logistique de confiance..."
  },
  // ... translations
}
```

2. Update konfigurasi bahasa:
```javascript
// src/scripts/configs/language.config.js
export const LANGUAGE_CONFIG = {
  id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
  en: { name: 'English', flag: '🇺🇸' },
  ms: { name: 'Bahasa Malaysia', flag: '🇲🇾' },
  fr: { name: 'Français', flag: '🇫🇷' } // Tambahkan bahasa baru
};
```

### Menambah Komponen Baru

1. Buat file HTML di `src/components/`:
```html
<!-- src/components/testimonials.html -->
<section class="testimonials">
  <h2 data-translate="testimonials.title">Customer Reviews</h2>
  <!-- ... content -->
</section>
```

2. Update index.html:
```html
<div id="testimonials-component"></div>
```

3. Tambahkan ke component loader:
```javascript
const components = [
  // ... existing components
  { name: 'testimonials', id: 'testimonials-component' }
];
```

### Custom Styling

```css
/* src/styles/custom.css */
:root {
  --custom-primary: #your-color;
  --custom-secondary: #your-color;
}

.custom-component {
  background: var(--custom-primary);
  /* ... your styles */
}
```

## 🛠️ Development

### Menjalankan Development Server

```bash
npm run dev
```
Server akan berjalan di `http://localhost:5173`

### Building untuk Production

```bash
npm run build
```
Output akan tersedia di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

### Debugging

Project dilengkapi dengan comprehensive logging:

```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');

// Check component status
console.log(window.MiWebMusicStore.getStatus());

// Monitor performance
console.log(window.PerformanceMonitor?.getStats?.());
```

## 📚 API Reference

### LanguageManager

```javascript
// Mengganti bahasa
await LanguageManager.setLanguage('en');

// Mendapatkan terjemahan
const text = LanguageManager.get('hero.title');

// Menerjemahkan element
LanguageManager.translateElement('#title', 'hero.title');
```

### VariantManager

```javascript
// Mengganti tema
VariantManager.setVariant('skyarrow');

// Mendapatkan tema aktif
const current = VariantManager.getVariant();

// Listen perubahan tema
window.addEventListener('variantChanged', (e) => {
  console.log('New variant:', e.detail.variant);
});
```

### ComponentManager

```javascript
// Load komponen dinamis
await ComponentManager.renderComponent('header', '#container');

// Load multiple components
await ComponentManager.renderComponents([
  { name: 'header', container: '#header' },
  { name: 'footer', container: '#footer' }
]);

// Preload komponen
await ComponentManager.preloadComponents(['footer', 'contact']);

// Check cache status
console.log(ComponentManager.getCacheStatus());

// Hot reload component (development)
await ComponentManager.hotReload('header');
```

### CounterUtils

```javascript
// Initialize all counters
CounterUtils.init();

// Force start counter animation
CounterUtils.forceInit();

// Set counter value manually
CounterUtils.setCounterValue(element, 1000);

// Reset all counters
CounterUtils.resetAllCounters();
```

### AnimationUtils

```javascript
// Initialize animations
AnimationUtils.init();

// Cleanup animations
AnimationUtils.cleanup();

// Check animated elements
console.log(AnimationUtils.animatedElements.size);
```

### NotificationUtils

```javascript
// Show success notification
NotificationUtils.success('Operasi berhasil!');

// Show error notification
NotificationUtils.error('Terjadi kesalahan!');

// Show info notification
NotificationUtils.info('Informasi penting');

// Clear all notifications
NotificationUtils.clearAll();
```

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | ≥ 90 |
| Firefox | ≥ 88 |
| Safari | ≥ 14 |
| Edge | ≥ 90 |

## 📄 Changelog

### v1.2.0 (Current) 🚀
- ✅ **Multiple Page Layouts** - Homepage, Single Page, Sidebar
- ✅ **Enhanced Component System** - Advanced ComponentManager with caching
- ✅ **Counter Animations** - Smooth counting with IntersectionObserver
- ✅ **Breadcrumb Navigation** - Professional navigation system
- ✅ **Off-Canvas Header** - Modern mobile-first navigation
- ✅ **Improved Form Handling** - Better validation and UX
- ✅ **Notification System** - User feedback notifications
- ✅ **Performance Optimizations** - Faster loading and rendering
- ✅ **JSON Structure Updates** - Better translation organization
- ✅ **Enhanced Documentation** - Updated guides and examples

### v1.1.0
- ✅ **Component Manager** - Dynamic component loading
- ✅ **Animation System** - Smooth animations and transitions
- ✅ **Utility Improvements** - Better DOM and HTTP utilities
- ✅ **Storage Management** - Enhanced localStorage utilities
- ✅ **Error Handling** - Better error management and debugging

### v1.0.0
- ✅ Initial release
- ✅ 8 dynamic themes
- ✅ Multi-language support (ID, EN, MS)
- ✅ Responsive design
- ✅ Component-based architecture
- ✅ Performance optimizations

### v1.3.0 (Planned) 🔮
- 🔄 **Tracking System** component khusus untuk widget tracking resi
- 🔄 **Dark Mode** support
- 🔄 **PWA** capabilities
- 🔄 **Enhanced Animations** with GSAP
- 🔄 **User Dashboard** for tenant customer dashboard
- 🔄 **E-commerce Integration** persiapan component untuk produk catalog dan toko online

## 🏢 Use Cases

Perfect untuk:

- **Perusahaan Logistik** - Website company profile dengan multiple layouts
- **Startup Delivery** - Landing page modern dengan counter animations
- **E-commerce** - Halaman shipping info dengan tracking system
- **Freight Services** - B2B logistics portal dengan sidebar layout
- **Courier Companies** - Customer service portal dengan off-canvas navigation
- **Multi-branch Companies** - Website dengan multi-language support
- **Corporate Websites** - Professional layout dengan breadcrumb navigation
- **Portfolio Sites** - Clean layout dengan component-based structure

## 🚀 Quick Demo

### Untuk Homepage Layout:
```bash
# Buka index.html untuk melihat homepage lengkap
open index.html
```

### Untuk Single Page Layout:
```bash
# Buka single-page.html untuk layout konten
open single-page.html
```

### Untuk Sidebar Layout:
```bash
# Buka single-page-sidebar.html untuk layout dengan sidebar
open single-page-sidebar.html
```

### Test Theme Switching:
1. Buka website
2. Klik variant selector di pojok kanan atas
3. Pilih tema yang berbeda
4. Lihat perubahan real-time tanpa reload

### Test Multi-Language:
1. Klik language selector
2. Pilih bahasa (Indonesia, English, Malaysia)
3. Lihat konten berubah secara dinamis

## 📞 Support

- 📧 **Email**: support@MiWebMusicStore.id
- 💬 **WhatsApp**: +6287887005722
- 🌐 **Website**: [MiWeb.Co.Id](https://miweb.co.id)
- 📱 **Social Media**: [@MiWeb](https://instagram.com/miweb)

## 📝 License

MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 🙏 Acknowledgments

- **Vite** - Lightning fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Iconify** - Comprehensive icon framework
- **Google Fonts** - Beautiful web typography
- **Logistics Companies** - Design inspiration

## 📝 AUTHOR

MiWeb Team