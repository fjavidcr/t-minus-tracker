<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const isMenuOpen = ref(false)
const route = useRoute()

// Close menu when route changes
watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header
    class="bg-surface/95 border-outline-variant/10 fixed top-0 z-[100] w-full border-b backdrop-blur-2xl transition-all duration-300"
  >
    <div class="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 md:px-12">
      <!-- Logo & Brand -->
      <NuxtLink to="/" class="group flex items-center gap-4">
        <div
          class="border-outline-variant/10 h-10 w-10 overflow-hidden rounded-xl border shadow-lg transition-transform active:scale-95 group-hover:scale-105"
        >
          <img src="/logo.webp" alt="T-Minus Logo" class="h-full w-full object-cover" />
        </div>
        <div class="flex flex-col items-start leading-none">
          <h1
            class="text-on-surface font-headline group-hover:text-primary text-2xl font-black uppercase tracking-tighter transition-colors"
          >
            T-minus
          </h1>
          <p
            class="text-on-surface-variant font-label mt-1 text-[0.6rem] font-bold uppercase tracking-[0.3em]"
          >
            Deep Space Archive
          </p>
        </div>
      </NuxtLink>

      <!-- Primary Navigation -->
      <nav
        class="font-label hidden items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] lg:flex"
      >
        <NuxtLink
          to="/"
          class="text-on-surface-variant hover:text-primary router-link-exact-active:border-primary router-link-exact-active:text-primary border-b-2 border-transparent py-2 transition-all"
          >Upcoming</NuxtLink
        >
        <NuxtLink
          to="/missions"
          class="text-on-surface-variant hover:text-primary router-link-active:border-primary router-link-active:text-primary border-b-2 border-transparent py-2 transition-all"
          >Missions</NuxtLink
        >
        <NuxtLink
          to="/calendar"
          class="text-on-surface-variant hover:text-primary router-link-active:border-primary router-link-active:text-primary border-b-2 border-transparent py-2 transition-all"
          >Calendar</NuxtLink
        >
      </nav>

      <!-- Search & Control -->
      <div class="flex items-center gap-6">
        <div
          class="bg-surface-container-low border-outline-variant/10 focus-within:border-primary/40 hidden items-center gap-3 rounded-full border px-4 py-2.5 transition-all md:flex"
        >
          <span class="material-symbols-outlined text-on-surface-variant text-sm">search</span>
          <input
            class="text-on-surface placeholder-on-surface-variant/40 font-label w-48 border-none bg-transparent text-[10px] uppercase tracking-[0.2em] outline-none focus:ring-0"
            placeholder="Search Deep Space..."
            type="text"
          />
        </div>
        <div class="relative z-[110] flex items-center gap-2">
          <NuxtLink
            to="/settings"
            class="hover:bg-surface-container text-on-surface-variant hover:text-primary hidden h-10 w-10 items-center justify-center rounded-full transition-colors sm:flex"
          >
            <span class="material-symbols-outlined text-xl">settings</span>
          </NuxtLink>
          <!-- Mobile Menu Toggle -->
          <button
            class="hover:bg-surface-container text-on-surface flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden"
            aria-label="Toggle Menu"
            @click="toggleMenu"
          >
            <span class="material-symbols-outlined text-2xl">
              {{ isMenuOpen ? 'close' : 'menu' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Overlay: Using Teleport to ensure it's on top of everything and truly opaque -->
    <Teleport to="body">
      <Transition name="slide-down">
        <div
          v-if="isMenuOpen"
          class="fixed inset-0 top-20 z-[999] flex flex-col space-y-8 overflow-y-auto bg-[#0f131c] p-8 lg:hidden"
        >
          <div class="flex flex-col space-y-4">
            <p
              class="text-primary/80 font-label mb-2 px-4 text-[10px] font-bold uppercase italic tracking-[0.3em]"
            >
              Navigation
            </p>
            <NuxtLink
              to="/"
              class="bg-surface-container-low border-outline-variant/10 group flex items-center justify-between rounded-2xl border px-4 py-7 shadow-lg"
            >
              <div class="flex items-center gap-5">
                <span class="material-symbols-outlined text-primary text-2xl">rocket_launch</span>
                <span
                  class="font-headline text-on-surface text-2xl font-black uppercase tracking-tight"
                  >Upcoming</span
                >
              </div>
              <span
                class="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-1"
                >arrow_forward</span
              >
            </NuxtLink>
            <NuxtLink
              to="/missions"
              class="bg-surface-container-low border-outline-variant/10 group flex items-center justify-between rounded-2xl border px-4 py-7 shadow-lg"
            >
              <div class="flex items-center gap-5">
                <span class="material-symbols-outlined text-primary text-2xl">database</span>
                <span
                  class="font-headline text-on-surface text-2xl font-black uppercase tracking-tight"
                  >Missions</span
                >
              </div>
              <span
                class="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-1"
                >arrow_forward</span
              >
            </NuxtLink>
            <NuxtLink
              to="/calendar"
              class="bg-surface-container-low border-outline-variant/10 group flex items-center justify-between rounded-2xl border px-4 py-7 shadow-lg"
            >
              <div class="flex items-center gap-5">
                <span class="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                <span
                  class="font-headline text-on-surface text-2xl font-black uppercase tracking-tight"
                  >Calendar</span
                >
              </div>
              <span
                class="material-symbols-outlined text-on-surface-variant transition-transform group-hover:translate-x-1"
                >arrow_forward</span
              >
            </NuxtLink>
          </div>

          <div class="border-outline-variant/10 mt-4 border-t pt-8">
            <NuxtLink
              to="/settings"
              class="bg-surface-variant/20 hover:bg-surface-variant/30 border-outline-variant/10 text-on-surface-variant group flex items-center gap-5 rounded-2xl border px-6 py-5 transition-all"
            >
              <span class="material-symbols-outlined">settings</span>
              <span class="font-label text-on-surface text-sm font-bold uppercase tracking-[0.15em]"
                >System Configuration</span
              >
            </NuxtLink>
          </div>

          <div class="mt-auto pb-12">
            <div
              class="bg-primary/5 border-primary/10 relative overflow-hidden rounded-2xl border p-6"
            >
              <div class="relative z-10">
                <p class="text-primary mb-1 text-[0.6rem] font-bold uppercase tracking-[0.2em]">
                  Status
                </p>
                <p class="text-on-surface text-xs font-medium tracking-wide">Orbital Link Active</p>
              </div>
              <div class="absolute -bottom-4 -right-4 rotate-12 opacity-5">
                <span class="material-symbols-outlined text-[100px]">language</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-label {
  font-family: 'Lexend', sans-serif;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
