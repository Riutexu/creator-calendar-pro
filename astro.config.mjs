import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://tu-usuario.github.io',
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
    },
  },
  prefetch: false,
  trailingSlash: 'never',
});