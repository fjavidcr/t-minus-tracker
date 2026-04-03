<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: 'dark'
  },
  bodyAttrs: {
    class: 'bg-[#0f131c] text-[#dfe2ee]'
  },
  style: [
    {
      innerHTML: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        body {
            font-family: 'Space Grotesk', sans-serif;
        }
        .mission-text-stroke {
            color: transparent;
            -webkit-text-stroke: 1px #FF6D00;
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
            background: radial-gradient(ellipse, rgba(255, 109, 0, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }
    `}
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap' }
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
  <!-- Since body uses flex, we use fragment so aside and main are direct children of body like Stitch -->
  <div
    class="flex min-h-screen selection:bg-primary selection:text-on-primary bg-[#0f131c] text-[#dfe2ee] font-sans antialiased w-full">
    <aside class="hidden md:flex flex-col h-screen w-64 left-0 sticky top-0 bg-surface-container-low py-8 z-50">
      <div class="px-8 mb-12">
        <h1 class="text-xl font-bold text-[#dfe2ee] tracking-tight uppercase">Orbitar</h1>
        <p class="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-on-surface-variant mt-1">Mission Control
        </p>
      </div>
      <nav class="flex-1 px-4 space-y-1">
        <NuxtLink to="/"
          class="flex items-center gap-4 bg-primary/10 text-primary px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all active:scale-95">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">rocket_launch</span>
          <span>Live Schedule</span>
        </NuxtLink>
        <NuxtLink to="/calendar"
          class="flex items-center gap-4 text-[#c4c6d3] px-4 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#1c2028] hover:text-primary transition-colors rounded-lg router-link-active:bg-primary/10 router-link-active:text-primary">
          <span class="material-symbols-outlined">calendar_month</span>
          <span>Calendar</span>
        </NuxtLink>
        <NuxtLink to="/settings"
          class="flex items-center gap-4 text-[#c4c6d3] px-4 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#1c2028] hover:text-primary transition-colors rounded-lg router-link-active:bg-primary/10 router-link-active:text-primary">
          <span class="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NuxtLink>
      </nav>
      <div class="mt-auto px-4 space-y-1 pt-8">
        <a class="flex items-center gap-4 text-[#c4c6d3] px-4 py-3 font-bold text-xs uppercase tracking-widest hover:bg-[#1c2028] hover:text-primary transition-colors rounded-lg"
          href="#">
          <span class="material-symbols-outlined">info</span>
          <span>About</span>
        </a>
        <div class="mt-8 px-4 py-6 bg-surface-container rounded-lg">
          <p class="text-[0.6rem] font-bold text-on-surface-variant uppercase tracking-widest mb-4">PUBLIC ACCESS
            TERMINAL</p>
          <button
            class="w-full bg-gradient-to-r from-secondary to-[#802a00] text-on-secondary py-3 text-xs font-bold uppercase tracking-[0.15em] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_24px_rgba(255,109,0,0.35)]">
            VIEW TELEMETRY
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 relative pb-20 md:pb-0">
      <!-- Top Navigation -->
      <header class="w-full top-0 sticky bg-surface-container-low z-40">
        <div class="flex justify-between items-center h-16 px-4 md:px-8 w-full">
          <div class="flex items-center gap-8">
            <span class="md:hidden text-xl font-bold tracking-tight text-[#dfe2ee]">Orbitar</span>
            <nav class="hidden md:flex gap-8">
              <NuxtLink to="/missions/artemis"
                class="text-[#c4c6d3] hover:text-primary transition-colors font-bold tracking-tight text-xs uppercase router-link-active:text-primary router-link-active:border-b-2 router-link-active:border-primary router-link-active:pb-1">
                Missions</NuxtLink>
              <NuxtLink to="/calendar"
                class="text-[#c4c6d3] hover:text-primary transition-colors font-bold tracking-tight text-xs uppercase router-link-active:text-primary router-link-active:border-b-2 router-link-active:border-primary router-link-active:pb-1">
                Calendar</NuxtLink>
              <NuxtLink to="/agencies"
                class="text-[#c4c6d3] hover:text-primary transition-colors font-bold tracking-tight text-xs uppercase router-link-active:text-primary router-link-active:border-b-2 router-link-active:border-primary router-link-active:pb-1">
                Agencies</NuxtLink>
              <NuxtLink to="/support"
                class="text-[#c4c6d3] hover:text-primary transition-colors font-bold tracking-tight text-xs uppercase router-link-active:text-primary router-link-active:border-b-2 router-link-active:border-primary router-link-active:pb-1">
                Support</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <div class="bg-surface-container-highest/50 px-4 py-2 flex items-center gap-3 rounded-lg">
              <span class="material-symbols-outlined text-on-surface-variant text-sm">search</span>
              <input
                class="bg-transparent border-none text-xs focus:ring-0 text-on-surface placeholder-on-surface-variant/50 w-48 md:w-64 font-medium outline-none"
                placeholder="Search mission archive..." type="text" />
            </div>
          </div>
        </div>
      </header>

 
      <!-- Main Pages Content (Real API driven views) -->
 
    <NuxtRouteAnnouncer />
    <NuxtPage />

      <!-- Floating Action Button -->
      <button
        class="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-[0_10px_30px_rgba(255,109,0,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50">
        <span class="material-symbols-outlined text-3xl">info</span>
        <span
          class="absolute right-full mr-6 bg-surface-container-high/90 backdrop-blur-xl px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-on-surface opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity shadow-[0_12px_32px_rgba(0,0,0,0.4)]">Consultation
          Info</span>
      </button>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
      class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low flex justify-around items-center h-16 px-4 z-50">
      <a class="flex flex-col items-center gap-1 text-primary" href="#">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">rocket_launch</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter">Schedule</span>
      </a>
      <a class="flex flex-col items-center gap-1 text-[#c4c6d3]" href="#">
        <span class="material-symbols-outlined">database</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter">Fleet</span>
      </a>
      <a class="flex flex-col items-center gap-1 text-[#c4c6d3]" href="#">
        <span class="material-symbols-outlined">history</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter">History</span>
      </a>
      <a class="flex flex-col items-center gap-1 text-[#c4c6d3]" href="#">
        <span class="material-symbols-outlined">search</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter">Search</span>
      </a>
    </nav>
  </div>
</template>

