import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss({
      // Allow @apply directive usage
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,html}",
      ],
    })
  ],
  build: {
    // Generate source maps for better debugging
    sourcemap: true
  },
  optimizeDeps: {
    // Pre-bundle JSON imports
    include: ['./src/locales/*.json']
  },
  // Enable JSON imports
  json: {
    stringify: true
  }
})
