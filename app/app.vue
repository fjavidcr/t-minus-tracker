<template>
  <div class="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 antialiased relative">
    <!-- Ambient glowing light -->
    <div class="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-[-1]" />
    <div class="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none z-[-1]" />
    
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<style>
/* Nuxt google fonts configuration using tailwind classes in root if needed, but the module handles loading */
body {
  font-family: 'Inter', sans-serif;
}
.font-display {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
