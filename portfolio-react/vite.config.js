import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep the base as '/' for local dev; change to your repo name for GitHub Pages
  base: '/',
});
