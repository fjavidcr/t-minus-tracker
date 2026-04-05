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
    class: 'bg-[#0f131c] text-[#dfe2ee]'
  },
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Geist:wght@100..900&family=Lexend:wght@100..900&display=swap' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }
  ],
  style: [
    {
      innerHTML: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        body {
            font-family: 'Geist', sans-serif;
            background-color: #0f131c;
            color: #dfe2ee;
            overflow-x: hidden;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Space Grotesk', sans-serif;
        }
        .font-label {
            font-family: 'Lexend', sans-serif;
        }
        .mission-text-stroke {
            color: transparent;
            -webkit-text-stroke: 1px #Fc3d21;
        }
        .hero-glow {
            position: relative;
        }
        .hero-glow::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 30%;
            transform: translate(-50%, -50%);
            width: 500px;
            height: 300px;
            background: radial-gradient(ellipse, rgba(11, 61, 145, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }
    `}
  ]
})
</script>

<template>
  <div
    class="flex flex-col min-h-screen selection:bg-secondary selection:text-on-secondary bg-surface text-on-surface font-body antialiased w-full overflow-x-hidden"
  >
    <!-- Header: Hidden on critical error to focus on Terminal -->
    <AppHeader v-if="!state.error" />

    <!-- Main Content Area -->
    <main class="flex-1 relative w-full pt-4 md:pt-8 overflow-hidden">
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

    <!-- Mobile Navigation: Hidden on critical error -->
    <AppBottomNav v-if="!state.error" />
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