<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useOrbitalLink } from '~/composables/useOrbitalLink';
import { UI_CONFIG } from '~/lib/constants';

const { setStatus } = useOrbitalLink();
const route = useRoute()
const missionId = route.params.id

const { data: mission, pending, error, refresh } = useFetch<any>(`/api/launch/${missionId}`, {
  lazy: true
})

// Sync status with global link
watch([pending, error], () => {
  setStatus(pending.value, error.value, refresh);
}, { immediate: true });

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

const isSticky = ref(false);

const handleScroll = () => {
  isSticky.value = window.scrollY > UI_CONFIG.THRESHOLDS.STICKY_HEADER;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  if (mission.value?.net) {
    countdown.value = getTimeUntil(mission.value.net) as any;
    timer = setInterval(() => {
      countdown.value = getTimeUntil(mission.value?.net) as any;
    }, UI_CONFIG.INTERVALS.COUNTDOWN);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (timer) clearInterval(timer);
});


useHead({
  title: `Mission Specs | ${mission.value?.name || 'Loading...'}`
})

const defaultImage = UI_CONFIG.ASSETS.DEFAULT_MISSION_IMAGE;
const rocketDefaultImage = UI_CONFIG.ASSETS.DEFAULT_ROCKET_IMAGE;

// Advanced Data Parsing
const launcherStage = computed(() => mission.value?.rocket?.launcher_stage?.[0]);
const core = computed(() => launcherStage.value?.launcher);
const landing = computed(() => launcherStage.value?.landing);
const missionPatch = computed(() => mission.value?.mission_patches?.[0]?.image_url);
const program = computed(() => mission.value?.program?.[0]);

// Robust Celestial Data Source
const celestialBody = computed(() => {
  return mission.value?.mission?.orbit?.celestial_body?.mass
    ? mission.value.mission.orbit.celestial_body
    : mission.value?.pad?.location?.celestial_body;
});


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

const formatCurrency = (value: number) => {
  if (!value) return 'TBD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const formatNumber = (value: number, unit: string = '') => {
  if (!value) return 'TBD';
  return new Intl.NumberFormat('en-US').format(value) + (unit ? ` ${unit}` : '');
};

// Action Helpers
const generateCalendarLink = () => {
  if (!mission.value?.net) return '#';
  const name = encodeURIComponent(`T-minus: ${mission.value.name}`);
  const description = encodeURIComponent(mission.value.mission?.description || '');
  const location = encodeURIComponent(mission.value.pad?.name || '');

  const startDate = new Date(mission.value.net).toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = new Date(new Date(mission.value.net).getTime() + 3600000).toISOString().replace(/-|:|\.\d+/g, '');

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${name}&details=${description}&location=${location}&dates=${startDate}/${endDate}`;
};

const shareStatus = ref('COPY LINK');
const isShareMenuOpen = ref(false);

const socialLinks = computed(() => {
  if (!mission.value) return {};
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = encodeURIComponent(`Tracking the ${mission.value.name} launch on T-minus! 🚀`);
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(url)}`
  };
});

const shareMission = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    shareStatus.value = 'COPIED';
    setTimeout(() => {
      shareStatus.value = 'COPY LINK';
      isShareMenuOpen.value = false;
    }, 2000);
  });
};

const toggleShareMenu = () => {
  isShareMenuOpen.value = !isShareMenuOpen.value;
};
</script>



<template>
  <main class="flex-1 overflow-y-auto bg-surface min-h-[calc(100vh-64px)] pb-12">

    <template v-if="mission">
      <!-- Hero Mission Section -->
      <section class="relative h-[680px] flex items-center px-12 overflow-visible bg-surface-container-lowest">
        <!-- Background Image: Spectacular & Vibrant -->
        <img class="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000" :src="mission.image?.image_url || defaultImage" />
        <div class="absolute inset-0 bg-gradient-to-r from-surface via-surface/20 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>

        <!-- Mission Patch: Floating safely below Navigation -->
        <div v-if="missionPatch" class="absolute right-12 top-14 z-[110] hidden lg:block transition-all duration-1000 pointer-events-none">
          <img :src="missionPatch" class="w-52 h-52 object-contain animate-float drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]" alt="Mission Patch" />
        </div>


        <div class="relative z-10 grid grid-cols-12 w-full gap-8">
          <div class="col-span-12 lg:col-span-7">
            <!-- Badges & Context -->
            <div class="flex flex-wrap items-center gap-3 mb-6 font-label uppercase text-[9px] font-black tracking-widest">
              <span class="bg-secondary text-on-secondary px-3 py-1 rounded-full shadow-lg shadow-secondary/20">{{ mission.status?.name || 'ACTIVE' }}</span>
              <span v-if="program" class="bg-primary/80 backdrop-blur-md text-on-primary border border-primary/30 px-3 py-1 rounded-full shadow-lg shadow-primary/20">{{ program.name }}</span>
              <span v-if="mission.probability" class="bg-surface/60 backdrop-blur-sm text-on-surface border border-outline-variant/30 px-3 py-1 rounded-full">WX PROB: {{ mission.probability }}%</span>
              <span class="text-on-surface font-bold bg-surface/40 backdrop-blur-sm px-3 py-1 rounded-full">NODE_ID: {{ mission.id?.slice(0, 8).toUpperCase() }}</span>
            </div>

            <h1 class="text-6xl lg:text-8xl font-black font-headline tracking-tighter text-on-surface mb-4 uppercase leading-[0.85] group drop-shadow-2xl">
              {{ mission.name.split('|')[0] }}<br />
              <span class="mission-text-stroke line-clamp-1 border-primary">{{ mission.name.split('|')[1] || mission.name }}</span>
            </h1>

            <p class="text-lg text-on-surface-variant font-body font-light tracking-wide mb-10 max-w-xl line-clamp-3">
              {{ mission.mission?.description || mission.status?.description || 'No mission description available.' }}
            </p>

            <div class="flex flex-wrap items-center gap-4 font-label uppercase text-[10px] font-black tracking-widest">
              <a v-if="mission.vid_urls?.length" :href="mission.vid_urls[0].url" target="_blank" class="bg-primary text-on-primary px-8 py-4 rounded-lg flex items-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary/20 cursor-pointer">
                <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">play_circle</span>
                LIVE STREAM
              </a>
              <a :href="generateCalendarLink()" target="_blank" class="bg-surface-variant/20 hover:bg-surface-variant/40 border border-outline-variant/20 text-on-surface px-8 py-4 rounded-lg transition-colors flex items-center gap-3 active:scale-95">
                <span class="material-symbols-outlined text-lg">calendar_add_on</span>
                ADD TO CALENDAR
              </a>
              <div class="relative">
                <button @click="toggleShareMenu" class="group bg-surface-variant/10 hover:bg-surface-variant/30 border border-outline-variant/10 text-on-surface-variant hover:text-on-surface px-8 py-4 rounded-lg transition-all flex items-center gap-2 active:scale-95">
                  <span class="material-symbols-outlined text-lg transition-transform group-hover:rotate-12">share</span>
                  <span class="uppercase">Share</span>
                </button>

                <!-- Social Share HUD Popover -->
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="transform scale-95 opacity-0 -translate-y-2"
                  enter-to-class="transform scale-100 opacity-100 translate-y-0"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="transform scale-100 opacity-100 translate-y-0"
                  leave-to-class="transform scale-95 opacity-0 -translate-y-2"
                >
                  <div v-if="isShareMenuOpen" class="absolute bottom-full left-0 mb-4 w-56 bg-surface/90 backdrop-blur-2xl border border-outline-variant/20 rounded-xl shadow-2xl p-2 z-[120]">
                    <div class="space-y-1">
                      <a :href="socialLinks.twitter" target="_blank" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/20 rounded-lg transition-colors group">
                        <span class="material-symbols-outlined text-lg text-on-surface-variant group-hover:text-primary">rocket_launch</span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-on-surface">Share on X</span>
                      </a>
                      <a :href="socialLinks.linkedin" target="_blank" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/20 rounded-lg transition-colors group">
                        <span class="material-symbols-outlined text-lg text-on-surface-variant group-hover:text-primary">groups_2</span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-on-surface">LinkedIn</span>
                      </a>
                      <a :href="socialLinks.whatsapp" target="_blank" class="flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/20 rounded-lg transition-colors group">
                        <span class="material-symbols-outlined text-lg text-on-surface-variant group-hover:text-[#25D366]">chat</span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-on-surface">WhatsApp</span>
                      </a>
                      <div class="h-px bg-outline-variant/10 my-1 mx-2"></div>
                      <button @click="shareMission" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-variant/20 rounded-lg transition-colors group">
                        <span class="material-symbols-outlined text-lg text-on-surface-variant group-hover:text-secondary">content_copy</span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-on-surface">{{ shareStatus }}</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>

            </div>

          </div>

          <!-- Countdown & Critical Window -->
          <div class="col-span-12 lg:col-span-5 flex flex-col justify-center relative">


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
              <div class="pt-4 border-b border-outline-variant/10 pb-4">
                <p class="text-[9px] font-black text-on-surface-variant uppercase tracking-widest font-label mb-2">Recovery Method</p>
                <p class="text-xs text-on-surface font-body leading-relaxed">{{ landing?.type?.name || 'Direct recovery or non-reusable profile.' }}</p>
              </div>
              <!-- Added Target Orbit context -->
              <div class="pt-4">
                <p class="text-[9px] font-black text-secondary uppercase tracking-widest font-label mb-2">Orbital Destination</p>
                <p class="text-sm font-black text-on-surface uppercase">{{ mission.mission?.orbit?.name || 'Unknown Orbit' }}</p>
                <p class="text-[8px] text-on-surface-variant font-bold mt-1 uppercase">{{ mission.mission?.orbit?.abbrev }} Profile</p>
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

                   <!-- Added Capacity Specs -->
                   <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div v-for="cap in [
                        { l: 'LEO CAP', v: formatNumber(mission.rocket?.configuration?.leo_capacity, 'kg') },
                        { l: 'GTO CAP', v: formatNumber(mission.rocket?.configuration?.gto_capacity, 'kg') },
                        { l: 'GEO CAP', v: formatNumber(mission.rocket?.configuration?.geo_capacity, 'kg') },
                        { l: 'HEIGHT', v: formatNumber(mission.rocket?.configuration?.length, 'm') }
                      ]" :key="cap.l" class="bg-surface-container/50 p-4 rounded-lg border border-outline-variant/10 text-center">
                         <p class="text-xs font-black text-on-surface uppercase">{{ cap.v }}</p>
                         <p class="text-[7px] text-on-surface-variant font-black uppercase mt-1">{{ cap.l }}</p>
                      </div>
                   </div>

                   <div class="bg-surface-container/30 rounded-xl p-6 border border-outline-variant/5">
                      <div class="flex justify-between items-center mb-6">
                         <p class="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] font-label">Systems Health</p>
                         <span class="text-[9px] font-black text-[#00FF41]">NOMINAL STATUS</span>
                      </div>
                      <div class="grid grid-cols-3 gap-8">
                         <div v-for="stat in [
                            { l: 'Max Thrust', v: formatNumber(mission.rocket?.configuration?.to_thrust, 'kN'), u: 'UNIT' },
                            { l: 'Launch Cost', v: formatCurrency(mission.rocket?.configuration?.launch_cost), u: 'USD' },
                            { l: 'Success MSN', v: mission.rocket?.configuration?.successful_launches, u: 'LOG' }
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
                       <div v-if="update.profile_image" class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20 mb-2">
                          <img :src="update.profile_image" class="w-full h-full object-cover" />
                       </div>
                       <div v-else class="w-1.5 h-1.5 rounded-full bg-primary mt-1 shadow-[0_0_8px_#0B3D91]"></div>
                       <div class="w-px flex-1 bg-outline-variant/20 my-2"></div>
                    </div>
                    <div class="pb-1">
                       <p class="text-[9px] font-black text-secondary uppercase tracking-widest mb-2 font-label">{{ formatDate(update.created_on) }}</p>
                       <p class="text-sm font-bold text-on-surface leading-snug mb-2">{{ update.comment }}</p>
                       <p class="text-xs text-on-surface-variant font-body">Source: <span class="text-primary">{{ update.info_url ? update.info_url.split('/')[2] : 'Ground Control' }}</span></p>
                    </div>
                 </div>
                 <div v-if="!mission.updates?.length" class="text-center py-12 border-2 border-dashed border-outline-variant/10 rounded-xl">
                    <span class="material-symbols-outlined text-4xl text-outline-variant/20 mb-4">analytics</span>
                    <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest">No critical status updates reported yet.</p>
                 </div>
              </div>
           </div>

           <!-- Provider Quick Stats -->
           <div class="lg:col-span-4 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex flex-col">
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
        </div>

        <!-- Detailed Agency, Location & Celestial Data -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <!-- Expanded Agency Knowledge Base -->
           <div class="lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
              <div class="flex items-center justify-between mb-8">
                 <div>
                    <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Agency Knowledge Base</p>
                    <h3 class="text-2xl font-black font-headline uppercase text-on-surface tracking-tight">{{ mission.launch_service_provider?.name }}</h3>
                 </div>
                 <img v-if="mission.launch_service_provider?.logo" :src="mission.launch_service_provider.logo.image_url" class="h-12 object-contain grayscale opacity-50" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div class="space-y-6">
                    <p class="text-sm font-body text-on-surface-variant leading-relaxed">{{ mission.launch_service_provider?.description }}</p>
                    <div class="flex flex-wrap gap-4 pt-4">
                       <a v-if="mission.launch_service_provider?.info_url" :href="mission.launch_service_provider.info_url" target="_blank" class="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:underline">
                          OFFICIAL SITE <span class="material-symbols-outlined text-xs">open_in_new</span>
                       </a>
                       <a v-if="mission.launch_service_provider?.wiki_url" :href="mission.launch_service_provider.wiki_url" target="_blank" class="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:underline">
                          WIKIPEDIA <span class="material-symbols-outlined text-xs">library_books</span>
                       </a>
                    </div>
                 </div>

                 <div class="bg-surface-container/30 rounded-xl p-6 border border-outline-variant/5 space-y-6">
                    <h4 class="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] font-label">Operational Record</h4>
                    <div class="space-y-4">
                       <div v-for="rec in [
                          { l: 'Successful Missions', v: mission.launch_service_provider?.successful_launches, c: 'text-primary' },
                          { l: 'Consecutive Success', v: mission.launch_service_provider?.consecutive_successful_launches, c: 'text-[#00FF41]' },
                          { l: 'Pending Operations', v: mission.launch_service_provider?.pending_launches, c: 'text-on-surface' }
                       ]" :key="rec.l" class="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                          <span class="text-[9px] font-bold text-on-surface-variant uppercase font-label">{{ rec.l }}</span>
                          <span class="text-lg font-black tabular-nums" :class="rec.c">{{ rec.v }}</span>
                       </div>
                    </div>
                    <div class="pt-2">
                       <p class="text-[9px] font-black text-on-surface-variant uppercase mb-1 font-label">Leadership</p>
                       <p class="text-xs font-bold text-on-surface">{{ mission.launch_service_provider?.administrator || 'Classified' }}</p>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Celestial & Environmental Data -->
           <div class="lg:col-span-4 flex flex-col gap-8">
              <!-- Celestial Body: Academic Context -->
              <div v-if="celestialBody" class="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex-1 relative overflow-hidden group">
                 <div class="absolute -right-10 -top-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                 <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-4 font-label">Celestial Mechanics</p>
                 <div class="flex items-center gap-4 mb-6">
                    <img v-if="celestialBody.image?.image_url" :src="celestialBody.image.image_url" class="w-16 h-16 rounded-full object-cover shadow-2xl animate-float" />
                    <div>
                       <h3 class="text-xl font-black font-headline uppercase text-on-surface tracking-tight">{{ celestialBody.name }}</h3>
                       <p class="text-[9px] font-bold text-on-surface-variant uppercase font-label">Target Gravitational Well</p>
                    </div>
                 </div>

                 <div class="space-y-4 font-label text-[10px]">
                    <div class="flex justify-between border-b border-outline-variant/10 pb-2">
                       <span class="text-on-surface-variant uppercase">Mass Index</span>
                       <span class="text-on-surface font-black" v-if="celestialBody.mass">{{ celestialBody.mass.toExponential(2) }} kg</span>
                       <span class="text-on-surface font-black" v-else>TBD</span>
                    </div>
                    <div class="flex justify-between border-b border-outline-variant/10 pb-2">
                       <span class="text-on-surface-variant uppercase">Gravitational Pull</span>
                       <span class="text-on-surface font-black" v-if="celestialBody.gravity">{{ celestialBody.gravity }} m/s²</span>
                       <span class="text-on-surface font-black" v-else>TBD</span>
                    </div>
                    <div class="flex justify-between border-b border-outline-variant/10 pb-2">
                       <span class="text-on-surface-variant uppercase">Atmosphere</span>
                       <span class="text-on-surface font-black uppercase">{{ celestialBody.atmosphere ? 'DETECTED' : 'VACUUM' }}</span>
                    </div>
                 </div>

                 <p class="mt-6 text-[10px] text-on-surface-variant font-body leading-relaxed line-clamp-3 opacity-60">
                    {{ celestialBody.description }}
                 </p>
              </div>

              <!-- Operational Site Map -->
              <div class="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 group">
                 <div class="flex items-center justify-between mb-6">
                    <div>
                       <p class="text-[10px] font-black text-on-surface-variant uppercase font-label tracking-widest">Ground Segment</p>
                       <p class="text-xs font-bold font-body text-on-surface uppercase">{{ mission.pad?.name }}</p>
                    </div>
                    <a v-if="mission.pad?.map_url" :href="mission.pad.map_url" target="_blank" class="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all">
                       <span class="material-symbols-outlined">map</span>
                    </a>
                 </div>
                 <div class="aspect-video bg-surface-container rounded-lg overflow-hidden relative mb-4">
                    <img v-if="mission.pad?.image?.image_url" :src="mission.pad.image.image_url" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div class="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent"></div>
                    <div class="absolute bottom-3 left-3 flex items-center gap-2">
                       <span class="material-symbols-outlined text-sm text-secondary">location_on</span>
                       <span class="text-[8px] font-black text-white uppercase tracking-widest">{{ mission.pad?.location?.name }}</span>
                    </div>
                 </div>
                 <p class="text-[9px] text-on-surface-variant font-body leading-relaxed line-clamp-2">
                    {{ mission.pad?.location?.description }}
                 </p>
              </div>
           </div>
        </div>

        <!-- Multimedia Coverage Hub -->
        <div v-if="mission.vid_urls?.length || mission.info_urls?.length" class="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
           <div class="flex items-center gap-4 mb-8">
              <span class="material-symbols-outlined text-secondary text-3xl">broadcast_on_home</span>
              <div>
                 <p class="text-[10px] font-black tracking-widest text-secondary uppercase mb-1 font-label">Multimedia Coverage</p>
                 <h3 class="text-2xl font-black font-headline uppercase text-on-surface tracking-tight">Mission Broadcasts & Resources</h3>
              </div>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="vid in mission.vid_urls" :key="vid.url" class="bg-surface-container/50 rounded-xl p-6 border border-outline-variant/10 flex flex-col group">
                 <div class="aspect-video bg-surface-container rounded-lg overflow-hidden mb-4 relative">
                    <img v-if="vid.feature_image" :src="vid.feature_image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span class="material-symbols-outlined text-white text-5xl">play_circle</span>
                    </div>
                    <span v-if="vid.type?.name" class="absolute top-2 right-2 bg-black/60 text-white text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest">{{ vid.type.name }}</span>
                 </div>
                 <h4 class="text-sm font-black text-on-surface uppercase mb-2 line-clamp-1">{{ vid.title }}</h4>
                 <p class="text-[10px] text-on-surface-variant font-body mb-6 line-clamp-3 leading-relaxed">{{ vid.description }}</p>
                 <div class="mt-auto flex items-center justify-between">
                    <span class="text-[8px] font-black text-secondary tracking-widest uppercase">{{ vid.publisher }}</span>
                    <a :href="vid.url" target="_blank" class="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary hover:text-on-primary transition-all">
                       <span class="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                 </div>
              </div>

              <!-- Info Links as smaller cards -->
              <div v-for="info in mission.info_urls" :key="info.url" class="bg-surface-container/50 rounded-xl p-6 border border-outline-variant/10 flex flex-col items-center justify-center text-center group border-dashed hover:border-solid transition-all">
                 <span class="material-symbols-outlined text-primary text-3xl mb-4 group-hover:rotate-12 transition-transform">article</span>
                 <h4 class="text-xs font-black text-on-surface uppercase mb-1">{{ info.title || info.source }}</h4>
                 <p class="text-[8px] text-on-surface-variant uppercase tracking-widest font-label mb-4">{{ info.type?.name || 'External Resource' }}</p>
                 <a :href="info.url" target="_blank" class="w-full bg-surface-container text-on-surface-variant py-3 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all">
                    ACCESS DOCUMENT
                 </a>
              </div>
           </div>
        </div>
      </section>
      <!-- Sticky Information Bar (Dashboard HUD) -->
      <nav
        class="fixed top-20 left-0 w-full z-[90] bg-surface/95 backdrop-blur-2xl border-b border-outline-variant/10 px-12 h-16 flex items-center justify-between transition-all duration-500 ease-in-out transform"
        :class="isSticky ? 'translate-y-0 opacity-100 shadow-xl' : '-translate-y-full opacity-0 pointer-events-none'"
      >
        <div class="flex items-center gap-6">
          <!-- Mini Mission Patch -->
          <img v-if="missionPatch" :src="missionPatch" class="w-10 h-10 object-contain drop-shadow-md" />

          <div class="flex flex-col">
            <h1 class="text-lg font-black font-headline tracking-tighter text-on-surface uppercase leading-none">
              {{ mission.name.split('|')[0] }}
            </h1>
            <p class="text-[9px] font-black uppercase tracking-widest mission-text-stroke">
               {{ mission.name.split('|')[1] || 'Primary Operation' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-12 font-label uppercase text-[9px] font-black tracking-[0.2em]">
          <div class="flex items-center gap-6 tabular-nums">
             <div class="flex items-center gap-1.5">
               <span class="text-on-surface">{{ countdown.days }}</span>
               <span class="text-secondary opacity-60">DAYS</span>
             </div>
             <div class="flex items-center gap-1.5">
               <span class="text-on-surface">{{ countdown.hours }}</span>
               <span class="text-secondary opacity-60">HRS</span>
             </div>
             <div class="flex items-center gap-1.5">
               <span class="text-on-surface">{{ countdown.minutes }}</span>
               <span class="text-secondary opacity-60">MIN</span>
             </div>
             <div class="flex items-center gap-1.5">
               <span class="text-secondary drop-shadow-[0_0_8px_rgba(252,61,33,0.5)]">{{ countdown.seconds }}</span>
               <span class="text-secondary opacity-60">SEC</span>
             </div>
          </div>

          <div class="hidden md:flex items-center gap-3 border-l border-outline-variant/20 pl-12">
             <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
             <span class="text-on-surface-variant font-black">Live Telemetry</span>
          </div>
        </div>
      </nav>
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
