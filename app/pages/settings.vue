<script setup lang="ts">
useHead({
  title: 'System Settings - Orbitar'
})
</script>

<template>
  <div class="px-4 md:px-8 py-10 w-full max-w-[1500px] mx-auto min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
      <div class="relative z-10">
        <p class="text-[0.7rem] font-black text-primary uppercase tracking-[0.6em] mb-4 drop-shadow-sm">System Config v9.1.4.1</p>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-on-surface uppercase leading-none">Console <span class="text-primary-container mission-text-stroke">Settings</span></h1>
      </div>
      <div class="flex items-center gap-8 bg-surface-container-low/60 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div class="flex flex-col items-end">
          <p class="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-2">Active Node</p>
          <p class="text-md font-mono text-primary uppercase font-black tracking-tight">ORBITAR-ALPHA-01</p>
        </div>
        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
          <span class="material-symbols-outlined text-primary text-4xl animate-pulse">sensors</span>
        </div>
      </div>
    </div>

    <!-- Asymmetrical Grid: 60/40 Split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">

      <!-- Left Column: Core Infrastructure (60%) -->
      <div class="lg:col-span-8 space-y-12">
        <!-- Telemetry & Appearance -->
        <section class="bg-surface-container-low/40 backdrop-blur-3xl rounded-[2.5rem] p-12 relative overflow-hidden group shadow-2xl border-none">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>

          <div class="flex items-center gap-5 mb-12 relative z-10">
            <span class="material-symbols-outlined text-primary text-3xl font-light">palette</span>
            <h2 class="text-sm font-black uppercase text-on-surface tracking-[0.5em]">HMI Control</h2>
          </div>

          <div class="space-y-12 relative z-10">
             <div class="flex flex-col md:flex-row items-start md:items-center justify-between p-10 rounded-3xl bg-surface-container/20 shadow-inner group/item transition-all hover:bg-surface-container/40 gap-8">
                <div>
                   <p class="text-[0.8rem] font-black text-on-surface uppercase tracking-[0.2em] mb-2">Luminance Spectrum</p>
                   <p class="text-[0.7rem] text-on-surface-variant uppercase tracking-widest font-bold opacity-60">Adaptive switching: Deep Space / Nebula bleed</p>
                </div>
                <div class="flex bg-surface-container-high/80 p-1.5 rounded-2xl shadow-2xl self-end md:self-auto border-none">
                   <button class="px-10 py-3.5 rounded-xl bg-gradient-to-r from-primary to-[#ff8c33] text-on-primary text-[0.75rem] font-black uppercase tracking-[0.3em] shadow-[0_10px_25px_rgba(255,109,0,0.3)] transition-all active:scale-95">Deep Void</button>
                   <button class="px-10 py-3.5 rounded-xl text-on-surface-variant hover:text-on-surface text-[0.75rem] font-black uppercase tracking-[0.3em] transition-colors">Nebula</button>
                </div>
             </div>

             <div class="space-y-8">
                <p class="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.6em]">Density Protocols</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <!-- Minimal -->
                   <div class="bg-primary/5 shadow-inner p-10 rounded-3xl flex flex-col items-center gap-8 cursor-pointer transition-all hover:scale-105 group/tile ring-1 ring-primary/20">
                      <div class="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border-none">
                         <div class="w-8 h-1 bg-primary shadow-[0_0_12px_#FF6D00]"></div>
                      </div>
                      <div class="text-center">
                         <span class="text-[0.75rem] font-black text-primary uppercase tracking-[0.3em] block mb-1">Minimal</span>
                         <span class="text-[0.5rem] font-mono text-primary/40 uppercase font-black">L-1 Logic</span>
                      </div>
                   </div>
                   <!-- Standard -->
                   <div class="bg-surface-container/10 p-10 rounded-3xl flex flex-col items-center gap-8 cursor-pointer transition-all hover:bg-surface-container/30 hover:scale-105 group/tile shadow-inner border-none">
                      <div class="w-16 h-16 rounded-2xl bg-on-surface/5 flex flex-col items-center justify-center gap-2 border-none">
                         <div class="w-8 h-1 bg-on-surface-variant/40"></div>
                         <div class="w-8 h-1 bg-on-surface-variant/40"></div>
                      </div>
                      <div class="text-center">
                         <span class="text-[0.75rem] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-1">Standard</span>
                         <span class="text-[0.5rem] font-mono text-on-surface-variant/20 uppercase font-black">L-2 Logic</span>
                      </div>
                   </div>
                   <!-- Tactical -->
                   <div class="bg-surface-container/10 p-10 rounded-3xl flex flex-col items-center gap-8 cursor-pointer transition-all hover:bg-surface-container/30 hover:scale-105 group/tile shadow-inner border-none">
                      <div class="w-16 h-16 rounded-2xl bg-on-surface/5 flex flex-col items-center justify-center gap-2 border-none">
                         <div class="w-8 h-1 bg-on-surface-variant/40"></div>
                         <div class="w-8 h-1 bg-on-surface-variant/40"></div>
                         <div class="w-8 h-1 bg-on-surface-variant/40"></div>
                      </div>
                      <div class="text-center">
                         <span class="text-[0.75rem] font-black text-on-surface-variant uppercase tracking-[0.3em] block mb-1">Tactical</span>
                         <span class="text-[0.5rem] font-mono text-on-surface-variant/20 uppercase font-black">L-3 Full</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        <!-- Connectivity Matrix -->
        <section class="bg-surface-container-low/40 backdrop-blur-3xl rounded-[2.5rem] p-12 group shadow-2xl border-none">
          <div class="flex items-center gap-5 mb-14 relative z-10">
            <span class="material-symbols-outlined text-primary text-3xl font-light">dns</span>
            <h2 class="text-sm font-black uppercase text-on-surface tracking-[0.5em]">Data Ingestion Nodes</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
             <div v-for="node in ['SpaceDevs API Payload', 'NASA Horizons Hub', 'SpaceX Telemetry Port', 'ESA Orbital Observation']" :key="node"
                  class="flex items-center justify-between p-8 bg-surface-container-low/40 rounded-3xl hover:bg-surface-container-low/80 transition-all cursor-pointer shadow-lg group/node border-none">
                <div class="flex items-center gap-6">
                   <div class="w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_#FF6D00] group-hover/node:scale-125 transition-transform duration-500"></div>
                   <span class="text-[0.85rem] font-black text-on-surface uppercase tracking-widest">{{ node }}</span>
                </div>
                <div class="text-right">
                    <span class="text-[0.6rem] font-mono text-primary font-black uppercase tracking-widest block">Linked</span>
                    <span class="text-[0.45rem] font-mono text-on-surface-variant font-bold opacity-30">12ms</span>
                </div>
             </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Status & Bio (40%) -->
      <div class="lg:col-span-4 space-y-12">
        <!-- Auth Profile: The Commander -->
        <section class="bg-surface-container-highest/50 backdrop-blur-3xl rounded-[3rem] p-14 flex flex-col items-center text-center relative overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] border-none">
           <div class="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
           <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

           <div class="relative w-48 h-48 mb-12 group">
              <!-- Orbiting Ring -->
              <div class="absolute inset-[-12%] rounded-full border-2 border-dashed border-primary/30 animate-[spin_40s_linear_infinite] group-hover:border-primary/60 transition-colors duration-1000"></div>
              <div class="absolute inset-0 rounded-full border border-white/5 shadow-inner bg-surface-container-highest/80 backdrop-blur-xl"></div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Orbitar-Commander-Prime" class="w-full h-full rounded-full p-4 relative z-10 drop-shadow-2xl" alt="Commander Avatar"/>
              <div class="absolute bottom-3 right-3 w-12 h-12 bg-primary rounded-2xl border-none flex items-center justify-center z-20 shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                 <span class="material-symbols-outlined text-2xl text-white font-black">verified_user</span>
              </div>
           </div>

           <h3 class="text-3xl font-black text-on-surface uppercase tracking-[0.3em] relative z-10 mb-3 drop-shadow-sm">Cmdr. Orbitar</h3>
           <p class="text-[0.75rem] font-black text-primary uppercase tracking-[0.6em] mb-14 relative z-10 opacity-90 underline underline-offset-8 decoration-primary/30">L-4 Security Clearance</p>

           <div class="grid grid-cols-1 gap-6 w-full relative z-10">
              <div class="bg-black/40 p-8 rounded-[2.5rem] flex flex-col text-left shadow-inner group/stat relative overflow-hidden">
                 <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div class="flex justify-between items-center mb-4 relative z-10">
                    <p class="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.3em]">Total Missions Observed</p>
                    <span class="material-symbols-outlined text-primary text-xl">visibility</span>
                 </div>
                 <p class="text-5xl font-mono text-on-surface font-light tracking-tighter leading-none relative z-10">1,248<span class="text-[0.7rem] text-primary ml-3 font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(255,109,0,0.5)]">Data Units</span></p>
              </div>
              <div class="bg-black/40 p-8 rounded-[2.5rem] flex flex-col text-left shadow-inner group/stat relative overflow-hidden">
                 <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div class="flex justify-between items-center mb-4 relative z-10">
                    <p class="text-[0.65rem] font-black text-on-surface-variant uppercase tracking-[0.3em]">Critical Protocol Alerts</p>
                    <span class="material-symbols-outlined text-primary text-xl">warning</span>
                 </div>
                 <p class="text-5xl font-mono text-on-surface font-light tracking-tighter leading-none relative z-10">42<span class="text-[0.7rem] text-primary ml-3 font-black uppercase tracking-tighter shadow-[0_0_10px_rgba(255,109,0,0.5)]">Crit State</span></p>
              </div>
           </div>

           <button class="w-full mt-14 bg-on-surface text-background py-6 rounded-3xl text-[0.85rem] font-black uppercase tracking-[0.6em] hover:bg-primary hover:text-on-primary transition-all duration-500 shadow-2xl active:scale-95 group/btn overflow-hidden relative">
              <div class="absolute inset-x-0 bottom-0 h-1 bg-primary/40 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
              Log Out of Node
           </button>
        </section>

        <!-- Automation Module -->
        <section class="p-12 bg-surface-container-low/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border-none space-y-12">
           <h4 class="text-[0.7rem] font-black text-on-surface-variant uppercase tracking-[0.6em] opacity-60">Automation Protocols</h4>
           <div class="space-y-10">
              <div class="flex items-center justify-between group/toggle">
                 <div>
                    <span class="text-[0.85rem] font-black text-on-surface uppercase tracking-widest block mb-1 group-hover/toggle:text-primary transition-colors">T-Minus 1H Alerts</span>
                    <span class="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Browser Push Enabled</span>
                 </div>
                 <div class="w-14 h-7 bg-primary/20 rounded-full relative cursor-pointer flex items-center px-1 shadow-inner border-none">
                    <div class="w-5 h-5 bg-primary rounded-full shadow-[0_0_15px_#FF6D00] translate-x-7 transition-transform duration-500"></div>
                 </div>
              </div>
              <div class="flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity group/toggle">
                 <div>
                    <span class="text-[0.85rem] font-black text-on-surface uppercase tracking-widest block mb-1 group-hover/toggle:text-primary transition-colors">Tactical Haptics</span>
                    <span class="text-[0.6rem] font-black text-on-surface-variant uppercase tracking-widest opacity-40">Session audio feedback</span>
                 </div>
                 <div class="w-14 h-7 bg-surface-container-highest rounded-full relative cursor-pointer flex items-center px-1 shadow-inner border-none">
                    <div class="w-5 h-5 bg-on-surface-variant rounded-full transition-transform duration-500"></div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mission-text-stroke {
  -webkit-text-stroke: 1.5px rgba(255, 109, 0, 0.4);
  color: transparent;
}
</style>
