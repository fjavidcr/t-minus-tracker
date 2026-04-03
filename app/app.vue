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
  <!-- Since body uses flex, we use fragment so aside and main are direct children of body like Stitch -->
  <div
    class="flex min-h-screen selection:bg-secondary selection:text-on-secondary bg-surface text-on-surface font-body antialiased w-full">
    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col h-screen w-64 left-0 sticky top-0 bg-surface-container-low py-8 z-50 shadow-[20px_0_40px_-15px_rgba(11,61,145,0.05)]">
      <div class="px-8 mb-12">
        <h1 class="text-xl font-black text-on-surface tracking-tighter uppercase font-headline">Orbitar</h1>
        <p class="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-primary mt-1 font-label">Deep Space Archive</p>
      </div>
      <nav class="flex-1 px-4 space-y-1 font-label uppercase tracking-widest text-[10px]">
        <NuxtLink to="/"
          class="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container hover:text-primary px-4 py-3 rounded-lg transition-all active:scale-95 router-link-active:bg-surface-container router-link-active:text-primary font-bold">
          <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">rocket_launch</span>
          <span>Upcoming</span>
        </NuxtLink>
        <NuxtLink to="/calendar"
          class="flex items-center gap-4 text-on-surface-variant px-4 py-3 font-bold hover:bg-surface-container hover:text-primary transition-colors rounded-lg router-link-active:bg-surface-container router-link-active:text-primary">
          <span class="material-symbols-outlined text-lg">calendar_month</span>
          <span>Calendar</span>
        </NuxtLink>
        <NuxtLink to="/fleet"
          class="flex items-center gap-4 text-on-surface-variant px-4 py-3 font-bold hover:bg-surface-container hover:text-primary transition-colors rounded-lg router-link-active:bg-surface-container router-link-active:text-primary">
          <span class="material-symbols-outlined text-lg">database</span>
          <span>Fleet</span>
        </NuxtLink>
      </nav>
      <div class="mt-auto px-4 space-y-1 pt-8 font-label uppercase tracking-widest text-[10px]">
        <NuxtLink to="/settings"
          class="flex items-center gap-4 text-on-surface-variant px-4 py-3 font-bold hover:bg-surface-container hover:text-primary transition-colors rounded-lg router-link-active:bg-surface-container router-link-active:text-primary">
          <span class="material-symbols-outlined text-lg">settings</span>
          <span>Settings</span>
        </NuxtLink>
        <div class="mt-8 px-4 py-6 bg-surface-container rounded-xl border border-outline-variant/10">
          <p class="text-[0.55rem] font-bold text-on-surface-variant uppercase tracking-widest mb-4">PUBLIC ACCESS TERMINAL</p>
          <button
            class="w-full bg-primary text-on-primary py-3 text-[0.65rem] font-bold uppercase tracking-[0.15em] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(11,61,145,0.3)]">
            DOWNLOAD MANIFEST
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 relative pb-20 md:pb-0">
      <!-- Top Navigation -->
      <header class="w-full top-0 sticky bg-surface z-40 border-b border-outline-variant/5">
        <div class="flex justify-between items-center h-16 px-4 md:px-8 w-full">
          <div class="flex items-center gap-8">
            <span class="md:hidden text-xl font-black tracking-tighter text-on-surface uppercase font-headline">Orbitar</span>
            <nav class="hidden md:flex gap-8 font-label text-[10px] uppercase tracking-[0.15em] font-bold">
              <NuxtLink to="/missions" class="text-on-surface-variant hover:text-primary transition-colors">Missions</NuxtLink>
              <NuxtLink to="/calendar" class="text-on-surface-variant hover:text-primary transition-colors router-link-active:text-primary router-link-active:border-b-2 router-link-active:border-primary pb-1">Calendar</NuxtLink>
              <NuxtLink to="/agencies" class="text-on-surface-variant hover:text-primary transition-colors">Agencies</NuxtLink>
              <NuxtLink to="/support" class="text-on-surface-variant hover:text-primary transition-colors">Support</NuxtLink>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <div class="bg-surface-container-low px-4 py-2 flex items-center gap-3 rounded-lg border border-outline-variant/10">
              <span class="material-symbols-outlined text-on-surface-variant text-sm">search</span>
              <input
                class="bg-transparent border-none text-[10px] focus:ring-0 text-on-surface placeholder-on-surface-variant/40 w-48 md:w-64 font-label uppercase tracking-widest outline-none"
                placeholder="Search archive..." type="text" />
            </div>
          </div>
        </div>
      </header>

      <NuxtRouteAnnouncer />
      <NuxtPage />

      <!-- Floating Action Button -->
      <button
        class="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-[0_10px_30px_rgba(252,61,33,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50">
        <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">priority_high</span>
        <span
          class="absolute right-full mr-6 bg-surface-container-highest/90 backdrop-blur-xl px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-on-surface opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all -translate-x-2 group-hover:translate-x-0 shadow-[0_12px_32px_rgba(0,0,0,0.4)]">Mission Alert</span>
      </button>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav
      class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant/10 flex justify-around items-center h-16 px-4 z-50">
      <NuxtLink to="/" class="flex flex-col items-center gap-1 text-on-surface-variant router-link-active:text-primary">
        <span class="material-symbols-outlined text-xl">rocket_launch</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter font-label">Missions</span>
      </NuxtLink>
      <NuxtLink to="/calendar" class="flex flex-col items-center gap-1 text-on-surface-variant router-link-active:text-primary">
        <span class="material-symbols-outlined text-xl">calendar_month</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter font-label">Calendar</span>
      </NuxtLink>
      <NuxtLink to="/fleet" class="flex flex-col items-center gap-1 text-on-surface-variant router-link-active:text-primary">
        <span class="material-symbols-outlined text-xl">database</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter font-label">Fleet</span>
      </NuxtLink>
      <NuxtLink to="/settings" class="flex flex-col items-center gap-1 text-on-surface-variant router-link-active:text-primary">
        <span class="material-symbols-outlined text-xl">settings</span>
        <span class="text-[0.55rem] font-bold uppercase tracking-tighter font-label">Settings</span>
      </NuxtLink>
    </nav>
  </div>

</template>

