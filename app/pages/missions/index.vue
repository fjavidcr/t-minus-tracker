<script setup lang="ts">
import { useSeoMeta } from '#imports';
import { ref, computed } from 'vue';

// SEO Meta Data
useSeoMeta({
  title: 'Missions Archive - Orbitar App',
  ogTitle: 'Missions Archive - Orbitar App',
  description: 'Explora el archivo completo de misiones espaciales próximas y recientes.',
});

// Pagination State
const limit = ref(12);
const offset = ref(0);

// Fetch data from Nitro backend with reactive query parameters
const { data: missions, pending, error } = await useFetch('/api/missions-archive', {
  query: { 
    limit, 
    offset 
  },
  watch: [offset] // Re-fetch when offset changes
});

const searchQuery = ref('');

// Filter on the current page's results
const filteredMissions = computed(() => {
  if (!missions.value?.results) return [];
  if (!searchQuery.value) return missions.value.results;
  
  const query = searchQuery.value.toLowerCase();
  return missions.value.results.filter((m: any) => 
    m.name?.toLowerCase().includes(query) || 
    m.launch_service_provider?.name?.toLowerCase().includes(query) ||
    m.rocket?.configuration?.name?.toLowerCase().includes(query)
  );
});

// Pagination Handlers
const totalRecords = computed(() => missions.value?.count || 0);
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const currentPage = computed(() => Math.floor(offset.value / limit.value) + 1);

const nextPage = () => {
  if (offset.value + limit.value < totalRecords.value) {
    offset.value += limit.value;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevPage = () => {
  if (offset.value > 0) {
    offset.value = Math.max(0, offset.value - limit.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const padZero = (num: number) => num.toString().padStart(2, '0');
</script>

<template>
  <div class="p-4 md:p-8 lg:p-12 space-y-12">
    <!-- Header Section -->
    <header class="space-y-6 relative border-b border-outline-variant/10 pb-12 overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute -top-10 -left-10 w-[400px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(252,61,33,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2 font-label animate-pulse">
            Terminal Access: Database Query
          </p>
          <h1 class="text-4xl lg:text-6xl font-black text-on-surface font-headline uppercase tracking-tighter leading-none">
            Mission Archive
          </h1>
        </div>
        
        <div class="flex items-center gap-4 text-on-surface-variant font-label text-[10px] uppercase tracking-widest bg-surface-container-low px-4 py-2 rounded border border-outline-variant/5">
          <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-secondary"></span> {{ totalRecords }} Records Found</span>
          <span class="w-px h-3 bg-outline-variant/30"></span>
          <span>Status: Verified</span>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative max-w-2xl group z-10 font-label">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-secondary transition-colors">search</span>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="SEARCH ARCHIVE (ID, AGENCY, ROCKET)..."
          class="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-4 pl-12 pr-6 text-xs font-bold uppercase tracking-widest text-on-surface focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-outline-variant/50"
        />
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="pending" class="h-96 flex flex-col items-center justify-center gap-4">
      <div class="w-12 h-12 border-t-2 border-primary rounded-full animate-spin"></div>
      <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary animate-pulse">Establishing Data Link...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-error-container text-on-error-container p-10 rounded-xl border border-error/20 font-mono text-center">
      <span class="material-symbols-outlined text-4xl mb-4">error</span>
      <p class="text-xs uppercase tracking-widest leading-relaxed">Error of transmission. Unable to connect to orbital data nodes. System restricted.</p>
    </div>

    <!-- Loaded State -->
    <template v-else>
      <div v-if="filteredMissions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <LaunchCard v-for="mission in filteredMissions" :key="mission.id" :launch="mission" />
      </div>
      
      <!-- No Results -->
      <div v-else class="h-64 flex flex-col items-center justify-center text-center space-y-4 opacity-50 bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/20">
        <span class="material-symbols-outlined text-6xl">search_off</span>
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] font-label">No records found Matching Query</p>
      </div>

      <!-- Pagination Controls -->
      <div class="mt-12 flex items-center justify-center gap-8 py-8 border-t border-outline-variant/10">
        <button 
          @click="prevPage" 
          :disabled="offset === 0"
          class="group flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-lg border border-outline-variant/10 transition-all font-label text-[9px] font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:border-secondary/30"
        >
          <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Previous
        </button>
        
        <div class="flex flex-col items-center gap-2">
          <span class="text-[10px] font-bold text-on-surface uppercase tracking-[0.3em] font-label">Page</span>
          <span class="text-2xl font-black font-headline text-secondary tabular-nums">{{ padZero(currentPage) }} <span class="text-xs text-on-surface-variant opacity-40 font-bold">/ {{ padZero(totalPages) }}</span></span>
        </div>

        <button 
          @click="nextPage" 
          :disabled="offset + limit >= totalRecords"
          class="group flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-lg border border-outline-variant/10 transition-all font-label text-[9px] font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:border-secondary/30"
        >
          Next
          <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </template>
    
    <!-- Archival Footer Info -->
    <footer class="pt-8 border-t border-outline-variant/5 flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-on-surface-variant font-label opacity-40">
       <span>Propagated from LL.TheSpaceDevs.com</span>
       <span>Orbitar Archive Index Rev: 2.3.0</span>
    </footer>
  </div>
</template>

<style scoped>
.font-headline { font-family: 'Space Grotesk', sans-serif; }
.font-body { font-family: 'Geist Sans', sans-serif; }
.font-label { font-family: 'Lexend', sans-serif; }
</style>
