<script setup lang="ts">
import { useSeoMeta } from '#imports';

// SEO Meta Data following the seo-audit skill guidelines
useSeoMeta({
  title: 'Orbitar App - NASA & Global Space Launch Calendar',
  ogTitle: 'Orbitar App - NASA & Global Space Launch Calendar',
  description: 'Descubre los próximos lanzamientos espaciales de NASA, SpaceX, y más. Mantente actualizado sobre exploración espacial, datos logísticos y rastreo orbital.',
  ogDescription: 'Descubre los próximos lanzamientos espaciales de NASA, SpaceX, y más. Seguimiento completo de misiones orbitales.',
  ogImage: 'https://orbitar.app/og-image.jpg',
  twitterCard: 'summary_large_image',
});

// Fetch data automatically from our Nitro Server Route (which caches the API)
const { data: launches, pending, error } = await useFetch('/api/launches');
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <header class="mb-16">
      <h1 class="text-5xl lg:text-7xl font-display font-medium text-foreground tracking-tighter mb-4">
        Lanzamientos<br/><span class="text-muted-foreground">Orbitales</span>
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl">
        Monitor de telemetría de misiones. Información en tiempo real programada respecto a lanzamientos de vehículos orbitales.
      </p>
    </header>

    <main>
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-card/40 rounded-xl h-64 animate-pulse border border-border/10"></div>
      </div>
      
      <div v-else-if="error" class="bg-destructive/10 text-destructive p-6 rounded-xl border border-destructive/20 font-mono">
        Error of transmission. Unable to connect to orbital data nodes.
      </div>
      
      <!-- Asymmetric grid as mandated by "The Orbiting Observatory" -->
      <div v-else-if="launches && launches.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <LaunchCard 
          v-for="(launch, index) in launches" 
          :key="launch.id" 
          :launch="launch" 
          :class="{ 'lg:col-span-2': index % 5 === 0 }"
        />
      </div>
      
      <div v-else class="text-muted-foreground text-center py-20 font-mono">
        No hay lanzamientos inminentes en la red.
      </div>
    </main>
  </div>
</template>
