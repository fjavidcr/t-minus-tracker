<template>
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
</template>

<style scoped>
.font-label { font-family: 'Lexend', sans-serif; }
</style>
