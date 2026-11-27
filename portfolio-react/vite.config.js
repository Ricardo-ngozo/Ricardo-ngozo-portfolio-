import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the base as '/' for local dev; change to your repo name for GitHub Pages
  base: '/',
  build: {
    // Three.js is isolated in a lazy 3D chunk (normally about 591 kB / 149 kB gzip).
    // This threshold warns on future regressions while allowing that expected engine chunk.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('/three/')) {
            if (id.includes('/addons/loaders/') || id.includes('/examples/jsm/loaders/')) {
              return 'three-loaders';
            }
            return 'three-core';
          }

          if (id.includes('/three-stdlib/')) return 'three-utils';
          if (id.includes('/gsap/')) return 'animation-vendor';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
