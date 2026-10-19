import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://riutexu.github.io',
  base: '/creator-calendar-pro',
  output: 'static',
  adapter: undefined,
  integrations: [tailwind()],
  compressHTML: true,
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
    minify: true,
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
  prefetch: false,
  trailingSlash: 'never',
});