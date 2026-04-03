<script setup lang="ts">
const route = useRoute()
const missionId = route.params.id

useHead({
  title: `Mission Archive | ${missionId?.toString().toUpperCase() || 'Details'}`
})

// In a real app, you'd fetch data here. For now, we use a template based on the mockup.
const missionName = computed(() => {
  if (missionId === 'artemis') return 'Artemis II'
  return 'Global Mission'
})
</script>

<template>
  <main class="flex-1 overflow-y-auto bg-surface min-h-[calc(100vh-64px)] pb-12">
    <!-- Hero Mission Section -->
    <section class="relative h-[480px] flex items-center px-12 overflow-hidden bg-surface-container-lowest">
      <img class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale" src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80"/>
      <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
      <div class="relative z-10 grid grid-cols-12 w-full gap-8">
        <div class="col-span-12 lg:col-span-7">
          <div class="flex items-center gap-3 mb-6 font-label uppercase text-[9px] font-black tracking-widest">
            <span class="bg-secondary text-on-secondary px-3 py-1 rounded-full">LIVE TELEMETRY</span>
            <span class="text-on-surface-variant">ID: ORB-II-004</span>
          </div>
          <h1 class="text-7xl font-black font-headline tracking-tighter text-on-surface mb-2 uppercase leading-none">{{ missionName }}</h1>
          <p class="text-lg text-on-surface-variant font-body font-light tracking-wide mb-10 max-w-xl">The first crewed mission of NASA's Artemis program to orbit the Moon, paving the way for lunar surface exploration.</p>
          <div class="flex items-center gap-6 font-label uppercase text-[10px] font-black tracking-widest">
            <button class="bg-primary text-on-primary px-8 py-4 rounded-lg flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary/20">
              <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">play_circle</span>
              LIVE STREAM
            </button>
            <button class="bg-surface-variant/20 hover:bg-surface-variant/40 border border-outline-variant/20 text-on-surface px-8 py-4 rounded-lg transition-colors">
              MISSION BRIEFING
            </button>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-5 flex flex-col justify-center">
          <div class="bg-surface-variant/10 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/10 shadow-2xl">
            <p class="text-on-surface-variant text-[9px] font-black tracking-[0.4em] uppercase mb-6 text-center font-label">T-MINUS TO IGNITION</p>
            <div class="flex justify-between items-baseline mb-8 gap-2 font-headline tabular-nums">
              <div class="text-center">
                <div class="font-black text-4xl text-on-surface">04</div>
                <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Days</div>
              </div>
              <div class="font-black text-3xl text-outline-variant/30 leading-none">:</div>
              <div class="text-center">
                <div class="font-black text-4xl text-on-surface">18</div>
                <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Hrs</div>
              </div>
              <div class="font-black text-3xl text-outline-variant/30 leading-none">:</div>
              <div class="text-center">
                <div class="font-black text-4xl text-on-surface">42</div>
                <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Min</div>
              </div>
              <div class="font-black text-3xl text-outline-variant/30 leading-none">:</div>
              <div class="text-center">
                <div class="font-black text-4xl text-secondary">09</div>
                <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Sec</div>
              </div>
            </div>
            <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div class="bg-secondary h-full w-3/4 shadow-[0_0_10px_rgba(252,61,33,0.5)]"></div>
            </div>
            <div class="flex justify-between mt-3 text-[9px] text-on-surface-variant uppercase font-black tracking-widest font-label">
              <span>Pre-Launch Prep</span>
              <span>Ignition Sequence</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical & Mission Grid -->
    <section class="p-12 space-y-12">
      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Technical Diagram Module -->
        <div class="md:col-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col border border-outline-variant/10 group">
          <div class="flex justify-between items-start mb-10">
            <div>
              <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Schematic 084-B</p>
              <h3 class="text-2xl font-black font-headline uppercase tracking-tight text-on-surface">Space Launch System (SLS)</h3>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary p-2 rounded-full hover:bg-surface-container transition-all">fullscreen</span>
          </div>
          <div class="flex-1 flex flex-col md:flex-row gap-12 items-center">
            <div class="w-full md:w-1/3 flex justify-center py-4">
              <img class="h-[420px] object-contain grayscale brightness-125 group-hover:brightness-100 transition-all duration-1000" src="https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80"/>
            </div>
            <div class="w-full md:w-2/3 space-y-8">
              <div class="border-l-2 border-primary/30 pl-6 py-1">
                <h4 class="text-[10px] font-black text-on-surface-variant uppercase mb-2 tracking-widest font-label">Stage 1: Core Stage</h4>
                <p class="text-sm font-body text-on-surface group-hover:text-primary transition-colors">Height: 65m | Thrust: 8.8 million lbs | Propellant: LH2/LOX</p>
              </div>
              <div class="border-l-2 border-outline-variant/20 pl-6 py-1">
                <h4 class="text-[10px] font-black text-on-surface-variant uppercase mb-2 tracking-widest font-label">Stage 2: ICPS</h4>
                <p class="text-sm font-body text-on-surface">Propulsion: RL10B-2 engine | Mission Role: TLI Burn</p>
              </div>
              <div class="border-l-2 border-secondary/30 pl-6 py-1">
                <h4 class="text-[10px] font-black text-on-surface-variant uppercase mb-2 tracking-widest font-label">Payload: Orion MPCV</h4>
                <p class="text-sm font-body text-on-surface group-hover:text-secondary transition-colors">Crew: 4 Personnel | Life Support: 21 Days Independent</p>
              </div>
              <div class="pt-6 grid grid-cols-2 gap-4 font-headline uppercase font-black">
                <div class="bg-surface-container rounded-lg p-5 border border-outline-variant/10 shadow-inner">
                  <p class="text-[9px] uppercase text-on-surface-variant mb-2 font-label">Max Velocity</p>
                  <p class="text-2xl text-primary tracking-tighter tabular-nums">39,500 <span class="text-[10px] font-bold opacity-40">km/h</span></p>
                </div>
                <div class="bg-surface-container rounded-lg p-5 border border-outline-variant/10 shadow-inner">
                  <p class="text-[9px] uppercase text-on-surface-variant mb-2 font-label">Liftoff Mass</p>
                  <p class="text-2xl text-primary tracking-tighter tabular-nums">2,600 <span class="text-[10px] font-bold opacity-40">Tons</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Trajectory Map -->
        <div class="bg-surface-container-low rounded-xl p-8 overflow-hidden relative flex flex-col border border-outline-variant/10 group">
          <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Orbital Dynamics</p>
          <h3 class="text-2xl font-black font-headline uppercase mb-10 text-on-surface tracking-tight">TLI Trajectory</h3>
          <div class="flex-1 relative rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container-lowest">
            <img class="absolute inset-0 w-full h-full object-cover opacity-30 grayscale mix-blend-screen" src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80"/>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-3/4 h-3/4 border-2 border-dashed border-secondary/30 rounded-full flex items-center justify-center group-hover:border-secondary/60 transition-all duration-1000 rotate-[32deg]">
                <div class="w-1/2 h-1/2 border border-primary/20 rounded-full animate-pulse"></div>
              </div>
            </div>
            <!-- Data Overlay -->
            <div class="absolute bottom-4 left-4 right-4 flex justify-between bg-surface-container/80 backdrop-blur px-4 py-2.5 rounded-lg text-[9px] font-black font-label border border-outline-variant/10 tracking-widest uppercase">
              <span class="text-secondary">ALT: 421.4KM</span>
              <span class="text-on-surface/60">INC: 28.5&deg;</span>
              <span class="text-on-surface">VEL: 7.82 KM/S</span>
            </div>
          </div>
          <p class="mt-6 text-[11px] font-body text-on-surface-variant leading-relaxed">Projected Trans-Lunar Injection (TLI) burn sequence initiates at T+01:24:12 after second orbit completion.</p>
        </div>
      </div>

      <!-- Systems Telemetry Matrix -->
      <section class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-3 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
          <div class="flex items-center justify-between mb-10">
            <h3 class="text-sm font-black uppercase tracking-[0.2em] font-headline text-on-surface">Systems Telemetry Matrix</h3>
            <div class="flex gap-6 font-label uppercase text-[9px] font-black tracking-widest">
              <span class="flex items-center gap-2 text-on-surface/40">
                <span class="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></span> Nominal
              </span>
              <span class="flex items-center gap-2 text-on-surface/40">
                <span class="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(252,61,33,0.5)]"></span> Warning
              </span>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-12">
            <div v-for="metric in [
              { label: 'Avionics Bus A', value: '28.4', unit: 'VDC', prog: 88, state: 'nominal' },
              { label: 'LOX Tank Pressure', value: '742', unit: 'PSI', prog: 94, state: 'nominal' },
              { label: 'Core Temp', value: '2,840', unit: 'K', prog: 82, state: 'warning' },
              { label: 'Cabin O2', value: '21.2', unit: '%', prog: 98, state: 'nominal' }
            ]" :key="metric.label" class="space-y-4">
              <p class="text-[9px] uppercase text-on-surface-variant font-black tracking-widest font-label">{{ metric.label }}</p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-black font-headline tabular-nums" :class="metric.state === 'warning' ? 'text-secondary' : 'text-on-surface'">{{ metric.value }}</span>
                <span class="text-[10px] text-on-surface-variant font-bold uppercase font-label">{{ metric.unit }}</span>
              </div>
              <div class="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div :class="['h-full transition-all duration-1000', metric.state === 'warning' ? 'bg-secondary' : 'bg-primary']" :style="{ width: metric.prog + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface-container-high rounded-xl p-8 flex flex-col border border-outline-variant/10">
          <h3 class="text-sm font-black uppercase tracking-widest font-headline mb-8">Mission Payload</h3>
          <div class="flex-1 space-y-8">
            <div class="flex gap-4 group">
              <div class="w-11 h-11 bg-surface-container-low flex items-center justify-center rounded-lg border border-outline-variant/10 transition-colors group-hover:border-secondary/40">
                <span class="material-symbols-outlined text-secondary text-xl" style="font-variation-settings: 'FILL' 1;">groups</span>
              </div>
              <div>
                <p class="text-[9px] font-black text-on-surface-variant uppercase font-label tracking-widest">Crew Complement</p>
                <p class="text-xs font-bold font-body text-on-surface uppercase mt-0.5">4 Personnel</p>
              </div>
            </div>
            <div class="flex gap-4 group">
              <div class="w-11 h-11 bg-surface-container-low flex items-center justify-center rounded-lg border border-outline-variant/10 transition-colors group-hover:border-secondary/40">
                <span class="material-symbols-outlined text-secondary text-xl">science</span>
              </div>
              <div>
                <p class="text-[9px] font-black text-on-surface-variant uppercase font-label tracking-widest">Bio-Research</p>
                <p class="text-xs font-bold font-body text-on-surface uppercase mt-0.5">Deep Space Radiometry</p>
              </div>
            </div>
          </div>
          <button class="w-full text-[10px] font-black text-secondary uppercase flex items-center justify-between group py-3 px-1 hover:translate-x-1 transition-all mt-8 border-t border-outline-variant/10 pt-8 font-label tracking-[0.2em]">
            View Manifest
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.mission-text-stroke {
  color: transparent;
  -webkit-text-stroke: 1.5px #0B3D91;
}
</style>
