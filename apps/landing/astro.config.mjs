import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { searchForWorkspaceRoot } from 'vite'

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap(), vue()],
  site: 'https://t-minus.fjdcr.dev',
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd()), '../../'],
        strict: false
      }
    }
  }
})
