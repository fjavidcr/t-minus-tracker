<script setup lang="ts">
import { computed } from 'vue';
import { useOrbitalLink } from '~/composables/useOrbitalLink';

const { state, refresh } = useOrbitalLink();
const route = useRoute();

// Bypasses the global orbital check for settings (local logic)
const isSettings = computed(() => route.path === '/settings');

useHead({
  htmlAttrs: {
    class: 'dark'
  },
  bodyAttrs: {
    class: 'selection:bg-artemis-orange/30'
  }
})
</script>

<template>
  <div
    class="flex flex-col min-h-screen selection:bg-secondary selection:text-on-secondary bg-surface text-on-surface font-body antialiased w-full overflow-x-hidden"
  >
    <!-- Header: Hidden on critical error to focus on Terminal -->
    <AppHeader v-if="!state.error" />

    <!-- Main Content Area -->
    <main class="flex-1 relative w-full pt-20 md:pt-24 overflow-hidden">
      <NuxtRouteAnnouncer />

      <!-- Global Mission Link Handling -->
      <template v-if="!isSettings">
        <!-- Dashboard Content: Fades out when loading, error, or connecting -->
        <div
          class="transition-all duration-700 ease-in-out"
          :class="{ 'opacity-0 scale-95 blur-sm pointer-events-none': state.pending || state.error || state.connecting }"
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

#__nuxt>div {
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