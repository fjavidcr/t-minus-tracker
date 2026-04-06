import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/webp', href: '/favicon.webp' }
      ]
    }
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/google-fonts'
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
  runtimeConfig: {
    // Shared private secret (only server-side)
    apiSecretKey: process.env.NUXT_API_SECRET_KEY,
    public: {
      // Custom header name for client identification
      orbitalClientHeader: 'x-orbital-client'
    }
  },
  build: {
    transpile: ['@t-minus/ui', '@t-minus/utils', 'reka-ui']
  },
  googleFonts: {
    families: {
      'Space Grotesk': [300, 400, 500, 600, 700],
      Inter: [300, 400, 500, 600, 700],
      Lexend: [300, 400, 500, 600, 700],
      'Material Symbols Outlined': true
    }
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    },
    server: {
      fs: {
        allow: ['../../packages', '../..']
      }
    },
    resolve: {
      alias: {
        '@t-minus/theme': '../../packages/theme/theme.css'
      }
    }
  }
})