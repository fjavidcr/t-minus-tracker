<script setup lang="ts">
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
</style>

<template>
  <div class="flex flex-col min-h-screen selection:bg-secondary selection:text-on-secondary bg-surface text-on-surface font-body antialiased w-full">
    <!-- Top Global Navigation -->
    <header class="w-full top-0 sticky bg-surface/80 backdrop-blur-xl z-[100] border-b border-outline-variant/10">
      <div class="flex justify-between items-center h-20 px-4 md:px-12 max-w-[1440px] mx-auto w-full">
        <!-- Logo & Brand -->
        <NuxtLink to="/" class="flex flex-col items-start group">
          <h1 class="text-2xl font-black text-on-surface tracking-tighter uppercase font-headline leading-none group-hover:text-primary transition-colors">T-minus</h1>
          <p class="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-primary/60 font-label">Deep Space Archive</p>
        </NuxtLink>

        <!-- Primary Navigation -->
        <nav class="hidden lg:flex items-center gap-10 font-label text-[10px] uppercase tracking-[0.2em] font-black">
          <NuxtLink to="/" class="text-on-surface-variant hover:text-primary transition-all py-2 border-b-2 border-transparent router-link-exact-active:border-primary router-link-exact-active:text-primary">Upcoming</NuxtLink>
          <NuxtLink to="/missions" class="text-on-surface-variant hover:text-primary transition-all py-2 border-b-2 border-transparent router-link-active:border-primary router-link-active:text-primary">Missions</NuxtLink>
          <NuxtLink to="/calendar" class="text-on-surface-variant hover:text-primary transition-all py-2 border-b-2 border-transparent router-link-active:border-primary router-link-active:text-primary">Calendar</NuxtLink>
          <NuxtLink to="/fleet" class="text-on-surface-variant hover:text-primary transition-all py-2 border-b-2 border-transparent router-link-active:border-primary router-link-active:text-primary">Fleet</NuxtLink>
          <NuxtLink to="/agencies" class="text-on-surface-variant hover:text-primary/60 transition-all py-2 opacity-50 cursor-help">Agencies</NuxtLink>
        </nav>

        <!-- Search & Control -->
        <div class="flex items-center gap-6">
          <div class="hidden md:flex bg-surface-container-low px-4 py-2.5 items-center gap-3 rounded-full border border-outline-variant/10 focus-within:border-primary/40 transition-all">
            <span class="material-symbols-outlined text-on-surface-variant text-sm">search</span>
            <input
              class="bg-transparent border-none text-[10px] focus:ring-0 text-on-surface placeholder-on-surface-variant/40 w-48 font-label uppercase tracking-[0.2em] outline-none"
              placeholder="Search Deep Space..." type="text" />
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink to="/settings" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-xl">settings</span>
            </NuxtLink>
            <!-- Mobile Menu Toggle -->
            <button class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface">
              <span class="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 relative w-full pt-4 md:pt-8">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>

    <!-- Mobile Bottom Navigation (Optional fallback) -->
    <nav class="lg:hidden fixed bottom-0 left-0 w-full bg-surface-container-low/95 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center h-20 px-4 z-50">
      <NuxtLink to="/" class="flex flex-col items-center gap-1.5 text-on-surface-variant router-link-exact-active:text-primary">
        <span class="material-symbols-outlined text-xl">rocket_launch</span>
        <span class="text-[0.6rem] font-bold uppercase tracking-widest font-label">Upcoming</span>
      </NuxtLink>
      <NuxtLink to="/missions" class="flex flex-col items-center gap-1.5 text-on-surface-variant router-link-active:text-primary">
        <span class="material-symbols-outlined text-xl">database</span>
        <span class="text-[0.6rem] font-bold uppercase tracking-widest font-label">Archive</span>
      </NuxtLink>
      <NuxtLink to="/calendar" class="flex flex-col items-center gap-1.5 text-on-surface-variant router-link-active:text-primary">
        <span class="material-symbols-outlined text-xl">calendar_month</span>
        <span class="text-[0.6rem] font-bold uppercase tracking-widest font-label">Calendar</span>
      </NuxtLink>
      <NuxtLink to="/settings" class="flex flex-col items-center gap-1.5 text-on-surface-variant router-link-active:text-primary">
        <span class="material-symbols-outlined text-xl">settings</span>
        <span class="text-[0.6rem] font-bold uppercase tracking-widest font-label">Settings</span>
      </NuxtLink>
    </nav>
  </div>
</template>

