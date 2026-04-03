// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
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
  googleFonts: {
    families: {
      'Space Grotesk': [300, 400, 500, 600, 700],
      Inter: [300, 400, 500, 600, 700],
      Lexend: [300, 400, 500, 600, 700]
    }
  }
})