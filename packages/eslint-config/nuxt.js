import vue from './vue.js'

/** @type {import('eslint').Linter.Config[]} */
const nuxtConfig = [
  ...vue,
  {
    languageOptions: {
      globals: {
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        useNuxtApp: 'readonly',
        useRuntimeConfig: 'readonly',
        useFetch: 'readonly',
        useAsyncData: 'readonly',
        useLazyFetch: 'readonly',
        useLazyAsyncData: 'readonly',
        useCookie: 'readonly',
        useRequestHeaders: 'readonly',
        useRequestEvent: 'readonly',
        useResponseHeader: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useState: 'readonly',
        useHead: 'readonly',
        useSeoMeta: 'readonly',
        useServerSeoMeta: 'readonly',
        navigateTo: 'readonly',
        abortNavigation: 'readonly',
        addRouteMiddleware: 'readonly',
        definePageMeta: 'readonly',
        onNuxtReady: 'readonly',
        useRouteAnnouncer: 'readonly',
        // Vue core
        computed: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        ref: 'readonly',
        watch: 'readonly',
        // Project specific
        useSecureFetch: 'readonly'
      },
    },
    rules: {
      // Nuxt-specific overrides
    },
  },
]

export default nuxtConfig
