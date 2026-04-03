<script setup lang="ts">
const route = useRoute()
const missionId = route.params.id

const { data: mission, pending, error } = await useFetch<any>(`/api/launch/${missionId}`)

const getTimeUntil = (dateString: string) => {
  if (!dateString) return null;
  const targetDate = new Date(dateString).getTime();
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference <= 0) return { days: '00', hours: '00', minutes: '00', seconds: '00', total: 0 };

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    total: difference
  };
};

const countdown = ref({ days: '00', hours: '00', minutes: '00', seconds: '00', total: 0 });
let timer: any;

onMounted(() => {
  if (mission.value?.net) {
    countdown.value = getTimeUntil(mission.value.net) as any;
    timer = setInterval(() => {
      countdown.value = getTimeUntil(mission.value?.net) as any;
    }, 1000);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

useHead({
  title: `Mission Specs | ${mission.value?.name || 'Loading...'}`
})

const defaultImage = 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80'
const rocketDefaultImage = 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80'
</script>

<template>
  <main class="flex-1 overflow-y-auto bg-surface min-h-[calc(100vh-64px)] pb-12">
    <div v-if="pending" class="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p class="text-on-surface-variant font-label uppercase tracking-[0.2em] text-[10px] font-black">Syncing Telemetry...</p>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] p-12 text-center">
      <span class="material-symbols-outlined text-secondary text-5xl mb-6">error</span>
      <h2 class="text-2xl font-black font-headline uppercase text-on-surface mb-2">Telemetry Lost</h2>
      <p class="text-on-surface-variant max-w-md mb-8">Unable to establish connection with SpaceDevs API. Please verify the mission ID and try again.</p>
      <NuxtLink to="/missions" class="bg-primary text-on-primary px-8 py-4 rounded-lg font-label uppercase text-[10px] font-black tracking-widest shadow-xl shadow-primary/20">
        Return to Archive
      </NuxtLink>
    </div>

    <template v-else-if="mission">
      <!-- Hero Mission Section -->
      <section class="relative h-[480px] flex items-center px-12 overflow-hidden bg-surface-container-lowest">
        <img class="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale" :src="mission.image?.image_url || defaultImage"/>
        <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
        <div class="relative z-10 grid grid-cols-12 w-full gap-8">
          <div class="col-span-12 lg:col-span-7">
            <div class="flex items-center gap-3 mb-6 font-label uppercase text-[9px] font-black tracking-widest">
              <span class="bg-secondary text-on-secondary px-3 py-1 rounded-full">{{ mission.status?.name || 'ACTIVE' }}</span>
              <span class="text-on-surface-variant">ID: {{ mission.id?.slice(0, 8).toUpperCase() }}</span>
            </div>
            <h1 class="text-5xl lg:text-7xl font-black font-headline tracking-tighter text-on-surface mb-4 uppercase leading-none">{{ mission.name }}</h1>
            <p class="text-lg text-on-surface-variant font-body font-light tracking-wide mb-10 max-w-xl line-clamp-3">
              {{ mission.mission?.description || mission.status?.description || 'No mission description available.' }}
            </p>
            <div class="flex items-center gap-6 font-label uppercase text-[10px] font-black tracking-widest">
              <a v-if="mission.vid_urls?.length" :href="mission.vid_urls[0].url" target="_blank" class="bg-primary text-on-primary px-8 py-4 rounded-lg flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">play_circle</span>
                LIVE STREAM
              </a>
              <button class="bg-surface-variant/20 hover:bg-surface-variant/40 border border-outline-variant/20 text-on-surface px-8 py-4 rounded-lg transition-colors">
                MISSION BRIEFING
              </button>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-5 flex flex-col justify-center" v-if="countdown.total > 0">
            <div class="bg-surface-variant/10 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/10 shadow-2xl">
              <p class="text-on-surface-variant text-[9px] font-black tracking-[0.4em] uppercase mb-6 text-center font-label">T-MINUS TO IGNITION</p>
              <div class="flex justify-between items-baseline mb-8 gap-2 font-headline tabular-nums">
                <div class="text-center">
                  <div class="font-black text-4xl text-on-surface">{{ countdown.days }}</div>
                  <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Days</div>
                </div>
                <div class="font-black text-3xl text-outline-variant/30 leading-none">:</div>
                <div class="text-center">
                  <div class="font-black text-4xl text-on-surface">{{ countdown.hours }}</div>
                  <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Hrs</div>
                </div>
                <div class="font-black text-3xl text-outline-variant/30 leading-none">:</div>
                <div class="text-center">
                  <div class="font-black text-4xl text-on-surface">{{ countdown.minutes }}</div>
                  <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Min</div>
                </div>
                <div class="font-black text-3xl text-outline-variant/30 leading-none">:</div>
                <div class="text-center">
                  <div class="font-black text-4xl text-secondary">{{ countdown.seconds }}</div>
                  <div class="text-[9px] text-secondary font-black uppercase mt-2 font-label">Sec</div>
                </div>
              </div>
              <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div class="bg-secondary h-full animate-pulse shadow-[0_0_10px_rgba(252,61,33,0.5)]" style="width: 65%"></div>
              </div>
              <div class="flex justify-between mt-3 text-[9px] text-on-surface-variant uppercase font-black tracking-widest font-label">
                <span>Pre-Launch Prep</span>
                <span>Ignition Sequence</span>
              </div>
            </div>
          </div>
          <div v-else class="col-span-12 lg:col-span-5 flex flex-col justify-center">
             <div class="bg-surface-variant/10 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/10 shadow-2xl text-center">
               <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-2 font-label">Mission Chrono</p>
               <h3 class="text-3xl font-black font-headline uppercase text-on-surface">LAUNCH COMPLETED</h3>
               <p class="text-xs text-on-surface-variant font-body mt-4">Telemetry integration successful. Checking post-flight data.</p>
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
                <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Vehicle Configuration</p>
                <h3 class="text-2xl font-black font-headline uppercase tracking-tight text-on-surface">{{ mission.rocket?.configuration?.full_name || 'Vehicle Specs' }}</h3>
              </div>
              <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-secondary p-2 rounded-full hover:bg-surface-container transition-all">fullscreen</span>
            </div>
            <div class="flex-1 flex flex-col md:flex-row gap-12 items-center">
              <div class="w-full md:w-1/3 flex justify-center py-4">
                <img class="h-[420px] object-contain grayscale brightness-125 group-hover:brightness-100 transition-all duration-1000" :src="mission.rocket?.configuration?.image?.image_url || rocketDefaultImage"/>
              </div>
              <div class="w-full md:w-2/3 space-y-8">
                <div class="border-l-2 border-primary/30 pl-6 py-1">
                  <h4 class="text-[10px] font-black text-on-surface-variant uppercase mb-2 tracking-widest font-label">Configuration Details</h4>
                  <p class="text-sm font-body text-on-surface leading-relaxed">{{ mission.rocket?.configuration?.description || 'No detailed vehicle description available.' }}</p>
                </div>
                
                <div class="pt-6 grid grid-cols-2 gap-4 font-headline uppercase font-black" v-if="mission.rocket?.configuration">
                  <div class="bg-surface-container rounded-lg p-5 border border-outline-variant/10 shadow-inner">
                    <p class="text-[9px] uppercase text-on-surface-variant mb-2 font-label">Successful Launches</p>
                    <p class="text-2xl text-primary tracking-tighter tabular-nums">{{ mission.rocket.configuration.successful_launches }} <span class="text-[10px] font-bold opacity-40">Missions</span></p>
                  </div>
                  <div class="bg-surface-container rounded-lg p-5 border border-outline-variant/10 shadow-inner">
                    <p class="text-[9px] uppercase text-on-surface-variant mb-2 font-label">Maiden Flight</p>
                    <p class="text-xl text-primary tracking-tighter tabular-nums">{{ mission.rocket.configuration.maiden_flight || 'TBD' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mission Provider -->
          <div class="bg-surface-container-low rounded-xl p-8 overflow-hidden relative flex flex-col border border-outline-variant/10 group">
            <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Launch Service Provider</p>
            <h3 class="text-2xl font-black font-headline uppercase mb-10 text-on-surface tracking-tight">{{ mission.launch_service_provider?.name }}</h3>
            <div class="flex-1 relative rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container-lowest p-6 flex flex-col items-center justify-center">
              <img v-if="mission.launch_service_provider?.logo" :src="mission.launch_service_provider.logo.image_url" class="max-h-32 object-contain grayscale hover:grayscale-0 transition-all duration-500 mb-8" />
              <div class="text-center">
                <p class="text-[11px] font-body text-on-surface-variant leading-relaxed">
                  {{ mission.launch_service_provider?.description?.slice(0, 200) }}...
                </p>
              </div>
            </div>
            <div class="mt-6 flex justify-between items-center bg-surface-container/50 px-4 py-3 rounded-lg border border-outline-variant/5">
              <div class="text-center">
                <p class="text-[8px] uppercase text-on-surface-variant font-black font-label mb-1">Country</p>
                <p class="text-xs font-bold text-on-surface">{{ mission.launch_service_provider?.country?.[0]?.alpha_3_code || 'INTL' }}</p>
              </div>
              <div class="text-center">
                <p class="text-[8px] uppercase text-on-surface-variant font-black font-label mb-1">Type</p>
                <p class="text-xs font-bold text-on-surface uppercase">{{ mission.launch_service_provider?.type?.name }}</p>
              </div>
            </div>
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
                { label: 'Launch Probability', value: mission.probability || '95', unit: '%', prog: mission.probability || 95, state: 'nominal' },
                { label: 'Successful Launches', value: mission.launch_service_provider?.successful_launches || 'N/A', unit: 'MSN', prog: 100, state: 'nominal' },
                { label: 'Window Start', value: new Date(mission.window_start).getHours(), unit: 'HRS', prog: 82, state: 'nominal' },
                { label: 'Weather Concerns', value: mission.weather_concerns ? 'CONCERN' : 'CLEAR', unit: 'STS', prog: mission.weather_concerns ? 40 : 100, state: mission.weather_concerns ? 'warning' : 'nominal' }
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
                  <p class="text-[9px] font-black text-on-surface-variant uppercase font-label tracking-widest">Orbit</p>
                  <p class="text-xs font-bold font-body text-on-surface uppercase mt-0.5">{{ mission.mission?.orbit?.name || 'TBD' }}</p>
                </div>
              </div>
              <div class="flex gap-4 group">
                <div class="w-11 h-11 bg-surface-container-low flex items-center justify-center rounded-lg border border-outline-variant/10 transition-colors group-hover:border-secondary/40">
                  <span class="material-symbols-outlined text-secondary text-xl">science</span>
                </div>
                <div>
                  <p class="text-[9px] font-black text-on-surface-variant uppercase font-label tracking-widest">Mission Type</p>
                  <p class="text-xs font-bold font-body text-on-surface uppercase mt-0.5">{{ mission.mission?.type || 'Test Flight' }}</p>
                </div>
              </div>
            </div>
            <a v-if="mission.wiki_url" :href="mission.wiki_url" target="_blank" class="w-full text-[10px] font-black text-secondary uppercase flex items-center justify-between group py-3 px-1 hover:translate-x-1 transition-all mt-8 border-t border-outline-variant/10 pt-8 font-label tracking-[0.2em] cursor-pointer">
              Wikipedia Entry
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </section>
      </section>
    </template>
  </main>
</template>

<style scoped>
.mission-text-stroke {
  color: transparent;
  -webkit-text-stroke: 1.5px #0B3D91;
}
</style>
