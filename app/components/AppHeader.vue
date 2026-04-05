<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const route = useRoute();

// Close menu when route changes
watch(() => route.fullPath, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header class="w-full top-0 fixed bg-surface/95 backdrop-blur-2xl z-[100] border-b border-outline-variant/10 transition-all duration-300">
    <div class="flex justify-between items-center h-20 px-4 md:px-12 max-w-[1440px] mx-auto w-full">
      <!-- Logo & Brand -->
      <NuxtLink to="/" class="flex flex-col items-start group">
        <h1 class="text-2xl font-black text-on-surface tracking-tighter uppercase font-headline leading-none group-hover:text-primary transition-colors">T-minus</h1>
        <p class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-on-surface-variant font-label">Deep Space Archive</p>
      </NuxtLink>

      <!-- Primary Navigation -->
      <nav class="hidden lg:flex items-center gap-10 font-label text-[10px] uppercase tracking-[0.2em] font-black">
        <NuxtLink to="/" class="text-on-surface-variant hover:text-primary transition-all py-2 border-b-2 border-transparent router-link-exact-active:border-primary router-link-exact-active:text-primary">Upcoming</NuxtLink>
        <NuxtLink to="/missions" class="text-on-surface-variant hover:text-primary transition-all py-2 border-b-2 border-transparent router-link-active:border-primary router-link-active:text-primary">Missions</NuxtLink>
        <NuxtLink to="/calendar" class="text-on-surface-variant hover:text-primary transition-all py-2 border-b-2 border-transparent router-link-active:border-primary router-link-active:text-primary">Calendar</NuxtLink>
      </nav>

      <!-- Search & Control -->
      <div class="flex items-center gap-6">
        <div class="hidden md:flex bg-surface-container-low px-4 py-2.5 items-center gap-3 rounded-full border border-outline-variant/10 focus-within:border-primary/40 transition-all">
          <span class="material-symbols-outlined text-on-surface-variant text-sm">search</span>
          <input
            class="bg-transparent border-none text-[10px] focus:ring-0 text-on-surface placeholder-on-surface-variant/40 w-48 font-label uppercase tracking-[0.2em] outline-none"
            placeholder="Search Deep Space..." type="text" />
        </div>
        <div class="flex items-center gap-2 relative z-[110]">
          <NuxtLink to="/settings" class="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary">
            <span class="material-symbols-outlined text-xl">settings</span>
          </NuxtLink>
          <!-- Mobile Menu Toggle -->
          <button 
            @click="toggleMenu"
            class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface"
            aria-label="Toggle Menu"
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
        <div v-if="isMenuOpen" 
          class="lg:hidden fixed inset-0 top-20 bg-[#0f131c] z-[999] flex flex-col p-8 space-y-8 overflow-y-auto"
        >
          <div class="flex flex-col space-y-4">
            <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80 font-label mb-2 px-4 italic">Navigation</p>
            <NuxtLink to="/" class="flex justify-between items-center px-4 py-7 rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-lg group">
              <div class="flex items-center gap-5">
                <span class="material-symbols-outlined text-primary text-2xl">rocket_launch</span>
                <span class="text-2xl font-black uppercase tracking-tight font-headline text-on-surface">Upcoming</span>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </NuxtLink>
            <NuxtLink to="/missions" class="flex justify-between items-center px-4 py-7 rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-lg group">
              <div class="flex items-center gap-5">
                <span class="material-symbols-outlined text-primary text-2xl">database</span>
                <span class="text-2xl font-black uppercase tracking-tight font-headline text-on-surface">Missions</span>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </NuxtLink>
            <NuxtLink to="/calendar" class="flex justify-between items-center px-4 py-7 rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-lg group">
              <div class="flex items-center gap-5">
                <span class="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                <span class="text-2xl font-black uppercase tracking-tight font-headline text-on-surface">Calendar</span>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </NuxtLink>
          </div>

          <div class="pt-8 mt-4 border-t border-outline-variant/10">
            <NuxtLink to="/settings" class="flex items-center gap-5 px-6 py-5 rounded-2xl bg-surface-variant/20 hover:bg-surface-variant/30 border border-outline-variant/10 transition-all group text-on-surface-variant">
              <span class="material-symbols-outlined">settings</span>
              <span class="text-sm font-bold uppercase tracking-[0.15em] font-label text-on-surface">System Configuration</span>
            </NuxtLink>
          </div>

          <div class="mt-auto pb-12">
            <div class="p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
              <div class="relative z-10">
                <p class="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-primary mb-1">Status</p>
                <p class="text-xs font-medium text-on-surface tracking-wide">Orbital Link Active</p>
              </div>
              <div class="absolute -right-4 -bottom-4 opacity-5 rotate-12">
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
.font-headline { font-family: 'Space Grotesk', sans-serif; }
.font-label { font-family: 'Lexend', sans-serif; }

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
