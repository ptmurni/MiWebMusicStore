// Theme Variant Configuration for MiWebMusic Store
// Color schemes inspired by music genres
// src/configs/variant.config.js

export const variantConfig = {
  // Default variant
  defaultVariant: 'jazzyblue',

  // Variant definitions inspired by music genres
  variants: {
    // Rock - Electric Red
    rockelectric: {
      name: 'Electric Rock',
      inspired: 'Rock & Roll',
      colors: {
        primary: '#D7263D',      // Electric Red
        primaryDark: '#A81D2B',
        primaryLight: '#F4436A',
        secondary: '#23272A',    // Deep Charcoal
        secondaryDark: '#121416',
        secondaryLight: '#43474B',
        accent: '#FFD600',       // Vibrant Yellow
        accentDark: '#C7A800',
        accentLight: '#FFEA4D',
        background: '#191B1F',
        surface: '#23272A',
        text: '#F6F6F6',
        textMuted: '#B0B0B0',
        success: '#21C95B',
        warning: '#FFD600',
        error: '#D7263D',
        info: '#FFD600'
      }
    },

    // Jazz - Smooth Indigo
    jazzyblue: {
      name: 'Smooth Jazz',
      inspired: 'Jazz Modern',
      colors: {
        primary: '#5B4B8A',      // Deep Indigo
        primaryDark: '#3C295A',
        primaryLight: '#7C6BAF',
        secondary: '#FFD86B',    // Soft Yellow
        secondaryDark: '#F3C05B',
        secondaryLight: '#FFE9A9',
        accent: '#D72660',       // Wine Red
        accentDark: '#A01B44',
        accentLight: '#EC658E',
        background: '#F9F6F2',
        surface: '#FFFFFF',
        text: '#232323',
        textMuted: '#7C6BAF',
        success: '#2ECC71',
        warning: '#FFD600',
        error: '#D72660',
        info: '#5B4B8A'
      }
    },

    // Pop - Bright Pink
    popshine: {
      name: 'Pop Shine',
      inspired: 'Pop Hits',
      colors: {
        primary: '#FF4C98',      // Bright Pink
        primaryDark: '#CC3A7A',
        primaryLight: '#FF8FC0',
        secondary: '#00B7FF',    // Electric Blue
        secondaryDark: '#0089C1',
        secondaryLight: '#6FDBFF',
        accent: '#FFE156',       // Pop Yellow
        accentDark: '#C7A800',
        accentLight: '#FFF599',
        background: '#FFF7FA',
        surface: '#FFFFFF',
        text: '#232323',
        textMuted: '#888888',
        success: '#06D6A0',
        warning: '#FFE156',
        error: '#FF4C4C',
        info: '#00B7FF'
      }
    },

    // Classical - Elegant Gold
    classicgold: {
      name: 'Classic Gold',
      inspired: 'Orkestra Klasik',
      colors: {
        primary: '#A67C52',      // Classical Brown Gold
        primaryDark: '#7C5A3C',
        primaryLight: '#D1B08A',
        secondary: '#E3C16F',    // Elegant Gold
        secondaryDark: '#B19550',
        secondaryLight: '#F5E3B6',
        accent: '#6986A5',       // Blue-gray (sheet music)
        accentDark: '#466080',
        accentLight: '#A5BED6',
        background: '#F6F3ED',
        surface: '#FFFFFF',
        text: '#232323',
        textMuted: '#A67C52',
        success: '#4CAF50',
        warning: '#E3C16F',
        error: '#D7263D',
        info: '#6986A5'
      }
    },

    // EDM - Neon Glow
    edmneon: {
      name: 'Neon EDM',
      inspired: 'Electronic Dance',
      colors: {
        primary: '#00FFB0',      // Neon Green
        primaryDark: '#00C987',
        primaryLight: '#5CFFD1',
        secondary: '#0059FF',    // Neon Blue
        secondaryDark: '#003FAD',
        secondaryLight: '#4D93FF',
        accent: '#FF00C8',       // Neon Pink
        accentDark: '#C8009C',
        accentLight: '#FF5CD9',
        background: '#18182B',
        surface: '#23234B',
        text: '#FAFAFA',
        textMuted: '#A1A1C9',
        success: '#00FFB0',
        warning: '#FFFB00',
        error: '#FF3B6A',
        info: '#00FFB0'
      }
    },

    // Reggae - Rasta Vibes
    rastavibes: {
      name: 'Rasta Vibes',
      inspired: 'Reggae Roots',
      colors: {
        primary: '#E02424',      // Red
        primaryDark: '#A61D1D',
        primaryLight: '#FF5757',
        secondary: '#FFD600',    // Yellow
        secondaryDark: '#C7A800',
        secondaryLight: '#FFF599',
        accent: '#00A651',       // Green
        accentDark: '#006837',
        accentLight: '#53E69B',
        background: '#F7F7F2',
        surface: '#FFF',
        text: '#232323',
        textMuted: '#888888',
        success: '#00A651',
        warning: '#FFD600',
        error: '#E02424',
        info: '#00A651'
      }
    }
  }
};

// Helper function to get genre inspiration info
export const getVariantInspiration = (variantName) => {
  const variant = variantConfig.variants[variantName];
  return variant ? {
    name: variant.name,
    genre: variant.inspired,
    primaryColor: variant.colors.primary,
    secondaryColor: variant.colors.secondary
  } : null;
};

// Helper function to generate CSS variables
export const generateCSSVariables = (variantName) => {
  const variant = variantConfig.variants[variantName];
  if (!variant) return '';
  return Object.entries(variant.colors)
    .map(([key, value]) => `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
    .join('\n');
};

// Fun easter egg: Get plesetan description
export const getPlesetanInfo = (variantName) => {
  const plesetanDescriptions = {
    rockelectric: "Semangat nge-rock, warnanya bikin panggung panas! 🎸",
    jazzyblue: "Smooth banget kayak solo saxophone malam minggu. 🎷",
    popshine: "Cerah ceria kayak chart lagu idol. 🌟",
    classicgold: "Elegan, kaya konser istana negara. 🎻",
    edmneon: "Disco warnanya nyala kayak lampu klub! 🕺",
    rastavibes: "Santai warnanya, vibes Jamaika masuk! 🟩🟨🟥"
  };
  return plesetanDescriptions[variantName] || "Warna kece buat semua genre! 🎼";
};
