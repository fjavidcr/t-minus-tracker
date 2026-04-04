<script setup lang="ts">
useHead({
  title: 'T-minus | Launch Calendar'
})

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
</script>

<template>
  <main class="flex-1 flex flex-col md:flex-row overflow-hidden bg-surface min-h-[calc(100vh-80px)]">
    <!-- Calendar View -->
    <section class="flex-1 p-8 overflow-y-auto custom-scrollbar">
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="font-label text-on-surface-variant uppercase tracking-[0.3em] font-medium text-[10px] mb-2">Classification: Schedule-Alpha</div>
          <h1 class="text-4xl font-black tracking-tighter text-on-surface font-headline uppercase leading-none">September 2024</h1>
        </div>
        <div class="flex items-center gap-2 bg-surface-container p-1 rounded-lg font-label">
          <button class="px-6 py-2 text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary rounded-lg shadow-sm transition-all focus:outline-none">Month</button>
          <button class="px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-all focus:outline-none">Week</button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-wrap gap-4 mb-8 font-label">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/10">
          <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(11,61,145,0.6)]"></span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">NASA</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/10">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(252,61,33,0.6)]"></span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">ESA</span>
        </div>
        <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg border border-outline-variant/10">
          <span class="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(173,203,218,0.6)]"></span>
          <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">SpaceX</span>
        </div>
        <button class="ml-auto text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <span class="material-symbols-outlined text-sm">filter_list</span>
          Advanced Filters
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-px bg-outline-variant/10 border border-outline-variant/10 overflow-hidden rounded-xl">
        <!-- Days Header -->
        <div v-for="day in days" :key="day" class="bg-surface-container-low py-3 text-center border-b border-outline-variant/10">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant font-label">{{ day }}</span>
        </div>

        <!-- Calendar Days (Mockup for Sep 2024) -->
        <div v-for="i in 35" :key="i" 
          :class="[
            'min-h-[140px] bg-surface p-3 flex flex-col gap-2 transition-colors hover:bg-surface-container/30 group',
            i < 6 || i > 30 ? 'opacity-30' : ''
          ]">
          <span class="text-[11px] font-bold font-label" :class="i === 11 ? 'text-secondary' : 'text-on-surface-variant'">
            {{ i <= 5 ? 26 + i : (i <= 30 ? i - 5 : i - 30) }}
          </span>
          
          <!-- Events -->
          <div v-if="i === 10" class="p-1.5 bg-primary/10 border-l-2 border-primary rounded-r-sm text-[9px] font-bold uppercase tracking-tighter text-primary truncate font-label">Artemis II Prep</div>
          <div v-if="i === 11" class="p-2 bg-secondary text-on-secondary rounded-sm text-[9px] font-black uppercase tracking-tighter truncate shadow-lg font-label">STARLINK v6.2</div>
          <div v-if="i === 11" class="p-1.5 bg-tertiary/10 border-l-2 border-tertiary rounded-r-sm text-[9px] font-bold uppercase tracking-tighter text-tertiary truncate font-label">Cargo Drag.</div>
          <div v-if="i === 15" class="p-1.5 bg-secondary/10 border-l-2 border-secondary rounded-r-sm text-[9px] font-bold uppercase tracking-tighter text-secondary truncate font-label">Ariane 6 Payload</div>
          <div v-if="i === 20" class="p-1.5 bg-error/10 border-l-2 border-error rounded-r-sm text-[9px] font-bold uppercase tracking-tighter text-error truncate font-label">H3-F4 Launch</div>
        </div>
      </div>
    </section>

    <!-- Upcoming Milestones Side Panel -->
    <aside class="w-full md:w-80 lg:w-96 bg-surface-container-low border-l border-outline-variant/5 p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
      <div>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-sm font-black tracking-tight text-on-surface uppercase font-headline">Upcoming Milestones</h2>
          <span class="material-symbols-outlined text-secondary text-lg">priority_high</span>
        </div>
        <div class="space-y-8">
          <!-- Milestone 1 -->
          <div class="relative group cursor-pointer">
            <div class="flex items-start gap-4">
              <div class="h-10 w-10 shrink-0 bg-surface-container rounded-lg flex items-center justify-center ring-1 ring-outline-variant/10 group-hover:ring-primary/50 transition-all">
                <span class="material-symbols-outlined text-primary text-lg">rocket</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-1 font-label">
                  <span class="text-[9px] font-black text-primary uppercase tracking-widest">NASA</span>
                  <span class="text-[9px] font-bold text-on-surface-variant">T-04D 12H</span>
                </div>
                <h3 class="text-xs font-bold text-on-surface mb-1 font-headline uppercase tracking-tight">Artemis II Orion Integration</h3>
                <p class="text-[11px] text-on-surface-variant leading-relaxed font-body">Final assembly of the crew module with the service module at Kennedy Space Center.</p>
              </div>
            </div>
          </div>
          <!-- Milestone 2 -->
          <div class="relative group cursor-pointer">
            <div class="flex items-start gap-4">
              <div class="h-10 w-10 shrink-0 bg-surface-container rounded-lg flex items-center justify-center ring-1 ring-outline-variant/10 group-hover:ring-secondary/50 transition-all">
                <span class="material-symbols-outlined text-secondary text-lg">satellite_alt</span>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start mb-1 font-label">
                  <span class="text-[9px] font-black text-secondary uppercase tracking-widest">ESA</span>
                  <span class="text-[9px] font-bold text-on-surface-variant">T-09D 04H</span>
                </div>
                <h3 class="text-xs font-bold text-on-surface mb-1 font-headline uppercase tracking-tight">JUICE Probe Correction</h3>
                <p class="text-[11px] text-on-surface-variant leading-relaxed font-body">Deep space maneuver to optimize the trajectory for the Jovian system injection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Diagnostics -->
      <div class="mt-auto pt-8 border-t border-outline-variant/10 space-y-6">
        <div>
          <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-label">Launch Site Status</h4>
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between font-label">
                <span class="text-[10px] text-on-surface font-bold uppercase tracking-tight">KSC LC-39B</span>
                <span class="text-[9px] font-black text-secondary uppercase tracking-widest">Go for Launch</span>
              </div>
              <div class="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div class="h-full bg-secondary w-[92%] shadow-[0_0_8px_rgba(252,61,33,0.4)]"></div>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between font-label">
                <span class="text-[10px] text-on-surface font-bold uppercase tracking-tight">Vandenberg SLC-4E</span>
                <span class="text-[9px] font-black text-primary uppercase tracking-widest">Nominal</span>
              </div>
              <div class="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div class="h-full bg-primary w-[75%] shadow-[0_0_8px_rgba(11,61,145,0.4)]"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/10">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-on-surface font-label">Live Telemetry</span>
          </div>
          <div class="aspect-video bg-surface-container-low rounded-lg relative overflow-hidden group">
            <img alt="Rocket Cam" class="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop"/>
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
            <div class="absolute bottom-2 left-2 right-2 flex justify-between items-end font-label text-[8px] uppercase font-bold text-on-surface-variant tracking-widest">
              <span>Pad Cam 09-B</span>
              <span class="material-symbols-outlined text-xs text-secondary">videocam</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1c2028;
  border-radius: 10px;
}
</style>
