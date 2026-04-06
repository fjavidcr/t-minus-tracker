// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/webp', href: '/favicon.webp' }
      ]
    }
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
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
  googleFonts: {
    families: {
      'Space Grotesk': [300, 400, 500, 600, 700],
      Inter: [300, 400, 500, 600, 700],
      Lexend: [300, 400, 500, 600, 700]
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  }
})