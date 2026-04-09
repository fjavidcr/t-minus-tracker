import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ href: '/favicon.webp', rel: 'icon', type: 'image/webp' }]
    }
  },
  build: {
    transpile: ['@t-minus/ui', '@t-minus/utils', 'reka-ui']
  },
  compatibilityDate: '2025-07-15',
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
      Lexend: [300, 400, 500, 600, 700],
      'Material Symbols Outlined': true,
      'Space Grotesk': [300, 400, 500, 600, 700]
    }
  },
  modules: ['@nuxtjs/google-fonts', '@vercel/analytics'],
  runtimeConfig: {
    // Shared private secret (only server-side)
    apiSecretKey: process.env['NUXT_API_SECRET_KEY'],
    public: {
      // Custom header name for client identification
      orbitalClientHeader: 'x-orbital-client'
    }
  },
  vite: {
    build: {
      sourcemap: false
    },
    optimizeDeps: {
      include: ['class-variance-authority', 'clsx', 'tailwind-merge']
    },
    plugins: tailwindcss(),
    resolve: {
      alias: {
        '@t-minus/theme': fileURLToPath(new URL('../../packages/theme/theme.css', import.meta.url))
      }
    },
    server: {
      fs: {
        allow: ['../../packages', '../..']
      }
    }
  }
})
