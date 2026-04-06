import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://t-minus.fjdcr.dev',
  integrations: [
    sitemap(),
    vue()
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['../../packages']
      }
    }
  },
});