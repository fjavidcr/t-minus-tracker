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

// Advanced Data Parsing
const launcherStage = computed(() => mission.value?.rocket?.launcher_stage?.[0]);
const core = computed(() => launcherStage.value?.launcher);
const landing = computed(() => launcherStage.value?.landing);
const missionPatch = computed(() => mission.value?.mission_patches?.[0]?.image_url);
const program = computed(() => mission.value?.program?.[0]);

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'TBD';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};
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
      <section class="relative h-[640px] flex items-center px-12 overflow-hidden bg-surface-container-lowest">
        <!-- Background Image: Spectacular & Vibrant -->
        <img class="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000" :src="mission.image?.image_url || defaultImage"/>
        <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>

        <!-- Mission Patch: Full Color & Floating above Countdown -->
        <div v-if="missionPatch" class="absolute right-[10%] top-[15%] z-50 hidden lg:block transition-all duration-1000">
          <img :src="missionPatch" class="w-56 h-56 object-contain animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" alt="Mission Patch" />
        </div>

        <div class="relative z-10 grid grid-cols-12 w-full gap-8">
          <div class="col-span-12 lg:col-span-7">
            <!-- Badges & Context -->
            <div class="flex flex-wrap items-center gap-3 mb-6 font-label uppercase text-[9px] font-black tracking-widest">
              <span class="bg-secondary text-on-secondary px-3 py-1 rounded-full shadow-lg shadow-secondary/20">{{ mission.status?.name || 'ACTIVE' }}</span>
              <span v-if="program" class="bg-primary/80 backdrop-blur-md text-on-primary border border-primary/30 px-3 py-1 rounded-full shadow-lg shadow-primary/20">{{ program.name }}</span>
              <span class="text-on-surface font-bold bg-surface/40 backdrop-blur-sm px-3 py-1 rounded-full">NODE_ID: {{ mission.id?.slice(0, 8).toUpperCase() }}</span>
            </div>

            <h1 class="text-6xl lg:text-8xl font-black font-headline tracking-tighter text-on-surface mb-4 uppercase leading-[0.85] group drop-shadow-2xl">
              {{ mission.name.split('|')[0] }}<br />
              <span class="mission-text-stroke line-clamp-1 border-primary">{{ mission.name.split('|')[1] || mission.name }}</span>
            </h1>

            <p class="text-lg text-on-surface-variant font-body font-light tracking-wide mb-10 max-w-xl line-clamp-3">
              {{ mission.mission?.description || mission.status?.description || 'No mission description available.' }}
            </p>

            <div class="flex flex-wrap items-center gap-6 font-label uppercase text-[10px] font-black tracking-widest">
              <a v-if="mission.vid_urls?.length" :href="mission.vid_urls[0].url" target="_blank" class="bg-primary text-on-primary px-8 py-4 rounded-lg flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">play_circle</span>
                LIVE STREAM
              </a>
              <button class="bg-surface-variant/20 hover:bg-surface-variant/40 border border-outline-variant/20 text-on-surface px-8 py-4 rounded-lg transition-colors">
                DOWNLOAD MANIFEST
              </button>
            </div>
          </div>

          <!-- Countdown & Critical Window -->
          <div class="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <div class="bg-surface-variant/10 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/10 shadow-2xl relative overflow-hidden">
              <!-- Glow corner -->
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 blur-3xl"></div>

              <p class="text-on-surface-variant text-[9px] font-black tracking-[0.4em] uppercase mb-6 text-center font-label">T-MINUS TO IGNITION</p>

              <div class="flex justify-between items-baseline mb-8 gap-2 font-headline tabular-nums" v-if="countdown.total > 0">
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
              <div v-else class="text-center py-4 mb-8">
                <h3 class="text-3xl font-black font-headline uppercase text-on-surface">LIFT OFF</h3>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between text-[8px] font-black uppercase tracking-widest text-on-surface-variant font-label">
                  <span>Launch Window Start</span>
                  <span>{{ formatDate(mission.window_start) }}</span>
                </div>
                <div class="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div class="bg-secondary h-full animate-pulse shadow-[0_0_10px_rgba(252,61,33,0.5)]" style="width: 100%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Technical Dossier Grid -->
      <section class="p-4 md:p-12 space-y-12">
        <!-- Main Technical Bento -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Booster & Reusability Card -->
          <div class="lg:col-span-4 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex flex-col relative overflow-hidden group">
            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
               <span class="material-symbols-outlined text-9xl">autorenew</span>
            </div>

            <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Booster Telemetry</p>
            <h3 class="text-2xl font-black font-headline uppercase mb-8 text-on-surface tracking-tight">Stage 01 Recovery</h3>

            <div class="space-y-6 flex-1">
              <div class="flex justify-between items-center py-4 border-b border-outline-variant/10">
                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">SerialNumber</span>
                <span class="text-sm font-black text-on-surface">{{ core?.serial_number || 'TBD' }}</span>
              </div>
              <div class="flex justify-between items-center py-4 border-b border-outline-variant/10">
                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">Flight Count</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-black text-on-surface">{{ launcherStage?.reused ? (launcherStage.launcher_flight_number + 'th Flight') : 'Maiden Flight' }}</span>
                  <span v-if="launcherStage?.reused" class="bg-primary/20 text-primary text-[8px] px-2 py-0.5 rounded font-black">FLIGHT PROVEN</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-4 border-b border-outline-variant/10">
                <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">Landing Target</span>
                <span class="text-sm font-black text-secondary text-right ml-4 line-clamp-1 uppercase">{{ landing?.location?.name || 'Ocean Splashdown' }}</span>
              </div>
              <div class="pt-4">
                <p class="text-[9px] font-black text-on-surface-variant uppercase tracking-widest font-label mb-2">Recovery Method</p>
                <p class="text-xs text-on-surface font-body leading-relaxed">{{ landing?.type?.name || 'Direct recovery or non-reusable profile.' }}</p>
              </div>
            </div>
          </div>

          <!-- Configuration & Diagram -->
          <div class="lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex flex-col md:flex-row gap-12 group">
             <div class="w-full md:w-1/3 flex flex-col">
                <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Vehicle Configuration</p>
                <h3 class="text-2xl font-black font-headline uppercase mb-8 text-on-surface tracking-tight">{{ mission.rocket?.configuration?.full_name }}</h3>
                <div class="flex-1 flex items-center justify-center p-4">
                   <img class="h-[380px] object-contain grayscale brightness-125 group-hover:brightness-100 transition-all duration-1000" :src="mission.rocket?.configuration?.image?.image_url || rocketDefaultImage"/>
                </div>
             </div>
             <div class="w-full md:w-2/3 flex flex-col space-y-10 pt-4">
                <div class="grid grid-cols-2 gap-6">
                   <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/10">
                      <p class="text-[9px] uppercase text-on-surface-variant mb-2 font-black font-label tracking-widest">Orbital Attempt</p>
                      <p class="text-3xl text-primary font-black font-headline tabular-nums">#{{ mission.orbital_launch_attempt_count }}</p>
                      <p class="text-[8px] text-on-surface-variant/60 font-black mt-1 uppercase">Global History Total</p>
                   </div>
                   <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/10">
                      <p class="text-[9px] uppercase text-on-surface-variant mb-2 font-black font-label tracking-widest">Agency YTD</p>
                      <p class="text-3xl text-primary font-black font-headline tabular-nums">{{ mission.agency_launch_attempt_count_year }}</p>
                      <p class="text-[8px] text-on-surface-variant/60 font-black mt-1 uppercase">Attemps in {{ new Date().getFullYear() }}</p>
                   </div>
                </div>

                <div class="space-y-6">
                   <div class="border-l-2 border-primary/30 pl-6 py-1">
                      <h4 class="text-[10px] font-black text-on-surface-variant uppercase mb-2 tracking-widest font-label">Configuration Details</h4>
                      <p class="text-sm font-body text-on-surface leading-relaxed line-clamp-4">{{ mission.rocket?.configuration?.description || 'No detailed vehicle description available.' }}</p>
                   </div>

                   <div class="bg-surface-container/30 rounded-xl p-6 border border-outline-variant/5">
                      <div class="flex justify-between items-center mb-6">
                         <p class="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] font-label">Systems Health</p>
                         <span class="text-[9px] font-black text-[#00FF41]">NOMINAL STATUS</span>
                      </div>
                      <div class="grid grid-cols-3 gap-8">
                         <div v-for="stat in [
                           { l: 'Max Thrust', v: mission.rocket?.configuration?.max_stage || '1st', u: 'STAGE' },
                           { l: 'Success MSN', v: mission.rocket?.configuration?.successful_launches, u: 'LOG' },
                           { l: 'Pad Turnaround', v: mission.pad_turnaround || '12', u: 'DAYS' }
                         ]" :key="stat.l" class="text-center">
                            <p class="text-xl font-black text-on-surface tabular-nums mb-1 font-headline">{{ stat.v }}</p>
                            <p class="text-[8px] text-on-surface-variant font-black uppercase tracking-widest font-label">{{ stat.l }}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Updates Timeline & Provider -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <!-- Launch Updates Feed -->
           <div class="lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
              <div class="flex items-center justify-between mb-10">
                 <div>
                    <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Intelligence Feed</p>
                    <h3 class="text-2xl font-black font-headline uppercase text-on-surface tracking-tight">Mission Updates</h3>
                 </div>
                 <div class="animate-pulse flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-secondary"></span>
                    <span class="text-[9px] font-black text-secondary tracking-widest">LIVE DATA SYNC</span>
                 </div>
              </div>

              <div class="space-y-12">
                 <div v-for="update in (mission.updates?.slice(0, 3) || [])" :key="update.id" class="flex gap-8 group">
                    <div class="flex flex-col items-center">
                       <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1 shadow-[0_0_8px_#0B3D91]"></div>
                       <div class="w-px flex-1 bg-outline-variant/20 my-2"></div>
                    </div>
                    <div class="pb-1">
                       <p class="text-[9px] font-black text-secondary uppercase tracking-widest mb-2 font-label">{{ formatDate(update.created_on) }}</p>
                       <p class="text-sm font-bold text-on-surface leading-snug mb-2">{{ update.comment }}</p>
                       <p class="text-xs text-on-surface-variant font-body">Source: <span class="text-primary">{{ update.info_url.split('/')[2] }}</span></p>
                    </div>
                 </div>
                 <div v-if="!mission.updates?.length" class="text-center py-12 border-2 border-dashed border-outline-variant/10 rounded-xl">
                    <span class="material-symbols-outlined text-4xl text-outline-variant/20 mb-4">analytics</span>
                    <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">No critical status updates reported yet.</p>
                 </div>
              </div>
           </div>

           <!-- Provider Quick Stats -->
           <div class="lg:col-span-4 flex flex-col gap-8">
              <div class="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex-1 flex flex-col">
                 <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Agency Profile</p>
                 <h3 class="text-xl font-black font-headline uppercase mb-8 text-on-surface tracking-tight">{{ mission.launch_service_provider?.name }}</h3>

                 <div class="flex-1 flex items-center justify-center mb-8">
                    <img v-if="mission.launch_service_provider?.logo" :src="mission.launch_service_provider.logo.image_url" class="max-h-24 object-contain grayscale hover:grayscale-0 transition-all" />
                 </div>

                 <div class="space-y-4 pt-4 border-t border-outline-variant/10">
                    <div class="flex justify-between items-center">
                       <span class="text-[9px] font-black text-on-surface-variant uppercase font-label">Total Missions</span>
                       <span class="text-sm font-black text-on-surface tabular-nums">{{ mission.launch_service_provider?.total_launch_count }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                       <span class="text-[9px] font-black text-on-surface-variant uppercase font-label">Established</span>
                       <span class="text-sm font-black text-on-surface tabular-nums">{{ mission.launch_service_provider?.founding_year || 'N/A' }}</span>
                    </div>
                 </div>
              </div>

              <!-- Pad Snapshot -->
              <div class="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
                 <div class="flex items-center gap-4 mb-6">
                    <div class="w-10 h-10 bg-surface-container flex items-center justify-center rounded-lg">
                       <span class="material-symbols-outlined text-secondary">location_on</span>
                    </div>
                    <div>
                       <p class="text-[9px] font-black text-on-surface-variant uppercase font-label tracking-widest">Operational Site</p>
                       <p class="text-xs font-bold font-body text-on-surface uppercase">{{ mission.pad?.location?.name.split(',')[0] }}</p>
                    </div>
                 </div>
                 <div class="space-y-3">
                    <div class="flex justify-between text-[9px] font-bold uppercase tracking-widest text-on-surface-variant font-label">
                       <span>Total Pad Flights</span>
                       <span class="text-on-surface">{{ mission.pad?.total_launch_count }}</span>
                    </div>
                    <div class="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                       <div class="bg-secondary h-full" style="width: 75%"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.mission-text-stroke {
  color: transparent;
  -webkit-text-stroke: 1.5px #0B3D91;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
