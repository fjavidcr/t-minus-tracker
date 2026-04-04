<template>
  <header class="w-full top-0 sticky bg-surface/80 backdrop-blur-xl z-[100] border-b border-outline-variant/10">
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
</template>

<style scoped>
.font-headline { font-family: 'Space Grotesk', sans-serif; }
.font-label { font-family: 'Lexend', sans-serif; }
</style>
