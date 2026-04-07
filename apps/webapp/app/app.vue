<script setup lang="ts">
import { computed } from 'vue'

import { useOrbitalLink } from '~/composables/useOrbitalLink'

const { refresh, state } = useOrbitalLink()
const route = useRoute()

// Bypasses the global orbital check for settings (local logic)
const isSettings = computed(() => route.path === '/settings')

useHead({
  bodyAttrs: {
    class: 'selection:bg-artemis-orange/30'
  },
  htmlAttrs: {
    class: 'dark'
  }
})
</script>

<template>
  <div
    class="selection:bg-secondary selection:text-on-secondary bg-surface text-on-surface font-body flex min-h-screen w-full flex-col overflow-x-hidden antialiased"
  >
    <!-- Header: Hidden on critical error to focus on Terminal -->
    <AppHeader v-if="!state.error" />

    <!-- Main Content Area -->
    <main class="relative w-full flex-1 overflow-hidden pt-20 md:pt-24">
      <NuxtRouteAnnouncer />

      <!-- Global Mission Link Handling -->
      <template v-if="!isSettings">
        <!-- Dashboard Content: Fades out when loading, error, or connecting -->
        <div
          class="transition-all duration-700 ease-in-out"
          :class="{
            'pointer-events-none scale-95 opacity-0 blur-sm':
              state.pending || state.error || state.connecting
          }"
        >
          <NuxtPage />
        </div>

        <!-- Overlays (Loading/Error): Only on client to avoid hydration flicker -->
        <ClientOnly>
          <Transition name="fade">
            <RocketLoading
              v-if="state.pending && !state.error"
              class="fixed inset-0 z-[100] bg-[#0f131c]"
            />
          </Transition>

          <Transition name="fade">
            <OrbitalError
              v-if="state.error"
              :error="state.error"
              :retry="refresh"
              class="fixed inset-0 z-[110] bg-[#0f131c]"
            />
          </Transition>
        </ClientOnly>
      </template>

      <!-- Settings page always bypasses orbital link checks -->
      <div v-else>
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<style>
body,
#__nuxt {
  margin: 0;
  padding: 0;
  width: 100% !important;
  max-width: 100% !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#__nuxt > div {
  flex: 1;
  width: 100%;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(10px);
}

/* Global fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
