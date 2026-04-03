<script setup lang="ts">
useHead({
  title: 'Orbitar App - NASA & Global Space Launch Calendar'
})

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <div class="px-4 md:px-8 py-8 w-full max-w-[1700px] mx-auto min-h-screen">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_4fr_2fr] gap-8 h-full">

      <!-- Left Column: Navigation/Tags (15%) -->
      <aside class="hidden lg:flex flex-col pt-24 gap-8">
        <div>
          <h3 class="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-4">Filters</h3>
          <div class="space-y-2">
            <button class="w-full text-left px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-[0.65rem] font-bold uppercase tracking-widest border-none transition-all">All Sources</button>
            <button class="w-full text-left px-4 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant text-[0.65rem] font-bold uppercase tracking-widest">NASA Archive</button>
            <button class="w-full text-left px-4 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant text-[0.65rem] font-bold uppercase tracking-widest">SpaceX Feed</button>
            <button class="w-full text-left px-4 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant text-[0.65rem] font-bold uppercase tracking-widest">ESA Internal</button>
          </div>
        </div>

        <div class="mt-8">
          <h3 class="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-4">Site Status</h3>
          <div class="p-5 bg-surface-container-low/60 backdrop-blur-md rounded-2xl space-y-5 shadow-inner">
             <div>
               <div class="flex justify-between mb-2">
                 <span class="text-[0.55rem] font-bold text-on-surface-variant uppercase tracking-widest">KSC 39B</span>
                 <span class="text-[0.55rem] font-black text-primary uppercase">Active</span>
               </div>
               <div class="h-1 bg-surface-container overflow-hidden rounded-full"><div class="h-full bg-primary w-full shadow-[0_0_8px_#FF6D00]"></div></div>
             </div>
             <div>
               <div class="flex justify-between mb-2">
                 <span class="text-[0.55rem] font-bold text-on-surface-variant uppercase tracking-widest">VAB-01</span>
                 <span class="text-[0.55rem] font-bold text-on-surface-variant uppercase">Standby</span>
               </div>
               <div class="h-1 bg-surface-container overflow-hidden rounded-full"><div class="h-full bg-on-surface-variant/20 w-1/3"></div></div>
             </div>
          </div>
        </div>
      </aside>

      <!-- Center Column: The Grid (55%) -->
      <section class="h-full flex flex-col pt-4">
        <div class="flex justify-between items-end mb-12">
          <div>
            <p class="text-[0.65rem] font-black text-primary uppercase tracking-[0.4em] mb-2">Schedule v4.2</p>
            <h1 class="text-6xl font-black tracking-tighter text-on-surface uppercase leading-none">September <span class="text-primary-container mission-text-stroke">2024</span></h1>
          </div>
          <div class="flex bg-surface-container-low/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl">
            <button class="bg-gradient-to-r from-primary to-[#ff8c33] text-on-primary px-8 py-2.5 rounded-xl text-[0.7rem] font-black uppercase tracking-[0.2em] shadow-[0_4px_14px_rgba(255,109,0,0.4)] transition-all">Month</button>
            <button class="text-on-surface-variant hover:text-on-surface px-8 py-2.5 rounded-xl text-[0.7rem] font-black uppercase tracking-[0.2em] transition-colors">Week</button>
          </div>
        </div>

        <!-- The Calendar Grid: Tiles with Gutters -->
        <div class="flex-1 flex flex-col min-h-[700px] mb-8">
          <!-- Day Headers -->
          <div class="grid grid-cols-7 gap-4 mb-4">
            <div v-for="day in days" :key="day" class="text-center text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.3em]">
              {{ day }}
            </div>
          </div>

          <!-- Date Matrix -->
          <div class="grid grid-cols-7 gap-4 flex-1">
            <!-- Individual Day Tiles -->
            <div v-for="i in 30" :key="i"
                 :class="[
                    'relative rounded-2xl p-4 flex flex-col group cursor-pointer transition-all duration-500 hover:scale-[1.04] hover:z-20 border-none',
                    i === 5 ? 'bg-primary/20 shadow-[0_0_40px_rgba(255,109,0,0.15)]' : 'bg-surface-container-low/60 backdrop-blur-md hover:bg-surface-container/80'
                 ]">
              <!-- Hover Glow Bleed -->
              <div class="absolute inset-x-[-15%] inset-y-[-15%] bg-primary/20 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-[60px] transition-opacity pointer-events-none"></div>

              <div class="flex justify-between items-start relative z-10">
                <span class="text-sm font-black" :class="i === 5 ? 'text-primary' : 'text-on-surface-variant'">{{ i < 10 ? '0' + i : i }}</span>
                <span v-if="i === 5 || i === 12" class="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_#FF6D00]"></span>
              </div>

              <!-- Events -->
              <div class="mt-auto space-y-2 relative z-10">
                <div v-if="i === 2" class="bg-blue-500/30 text-blue-300 p-1.5 rounded-lg text-[0.55rem] font-black uppercase truncate border-none">Starlink G6-12</div>
                <div v-if="i === 4" class="bg-primary/30 text-primary p-1.5 rounded-lg text-[0.55rem] font-black uppercase truncate border-none">Artemis II C-01</div>
                <div v-if="i === 5" class="bg-primary text-on-primary p-1.5 rounded-lg text-[0.55rem] font-black uppercase truncate shadow-2xl">Launch Integration</div>
              </div>
            </div>
            <!-- Padding for grid layout if needed -->
          </div>
        </div>
      </section>

      <!-- Right Column: Milestones (30%) -->
      <aside class="h-full pt-24 flex flex-col gap-8">
        <div class="bg-surface-container-high/60 backdrop-blur-2xl p-10 rounded-3xl relative overflow-hidden shadow-2xl">
           <div class="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full"></div>
           <h3 class="text-xs font-black uppercase tracking-[0.4em] text-on-surface mb-10">Mission Roadmap</h3>

          <div class="space-y-10 relative">
            <div class="absolute left-[3px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary via-outline-variant/30 to-outline-variant/10"></div>

            <div class="relative pl-10 group">
              <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_#FF6D00] group-hover:scale-125 transition-transform"></div>
              <p class="text-[0.6rem] font-black text-primary uppercase tracking-[0.2em] mb-2">T-12H Status</p>
              <h4 class="text-sm font-black text-on-surface leading-tight">VAB Structural Integration Complete</h4>
              <p class="text-[0.7rem] text-on-surface-variant mt-3 leading-relaxed">Stage 1 and 2 of the SLS core are now successfully mated within the VAB.</p>
            </div>

            <div class="relative pl-10 opacity-50 group">
              <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-surface-variant border-none group-hover:bg-primary transition-colors"></div>
              <p class="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2">T-48H Target</p>
              <h4 class="text-sm font-black text-on-surface leading-tight">Rollout to Launch Complex 39B</h4>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-low/60 backdrop-blur-md rounded-3xl p-8 shadow-inner">
          <div class="flex items-center gap-3 mb-6">
             <span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#FF6D00]"></span>
             <h3 class="text-[0.65rem] font-black uppercase tracking-[0.3em] text-on-surface">Telemetry Lock</h3>
          </div>
          <div class="aspect-video bg-black rounded-2xl overflow-hidden relative group shadow-2xl">
             <img src="https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-[3s] grayscale hover:grayscale-0"/>
             <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
             <div class="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
             <div class="absolute bottom-4 left-4">
               <p class="text-[0.6rem] font-mono text-primary font-bold leading-none uppercase tracking-widest">Pad Cam 09-B</p>
               <p class="text-[0.5rem] font-mono text-on-surface-variant uppercase mt-1">LAT: 28.52 N / LON: 80.68 W</p>
             </div>
             <div class="absolute top-4 right-4 flex items-center gap-2">
                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span class="text-[0.5rem] font-mono text-white font-bold tracking-[0.2em]">LIVE</span>
             </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
