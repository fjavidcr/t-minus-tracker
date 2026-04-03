<script setup lang="ts">
useHead({
  title: 'System Settings - Orbitar'
})

const notifications = ref(true)
const sounds = ref(true)
const autoRefresh = ref(false)
const units = ref('metric')
const theme = ref('deep-space')
</script>

<template>
  <main class="flex-1 flex flex-col overflow-x-hidden bg-surface min-h-[calc(100vh-64px)]">
    <!-- Page Content: Settings Console -->
    <div class="p-8 md:p-12 max-w-6xl mx-auto w-full">
      <!-- Header Section -->
      <div class="mb-16">
        <span class="font-label label-md uppercase tracking-[0.4em] text-primary text-[10px] font-black">Environment Matrix / v4.0</span>
        <h1 class="text-5xl font-black tracking-tighter text-on-surface mt-2 mb-4 font-headline uppercase leading-none">Console <span class="text-primary-container mission-text-stroke">Settings</span></h1>
        <p class="text-on-surface-variant max-w-2xl leading-relaxed text-sm font-body">Configure your local browser environment. These parameters are stored locally and do not affect mission telemetry.</p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <!-- Notification Presets (Large Card) -->
        <div class="md:col-span-8 bg-surface-container-low p-8 rounded-xl border border-outline-variant/5 relative overflow-hidden group">
          <div class="relative z-10">
            <h3 class="text-sm font-black mb-10 flex items-center gap-3 font-headline uppercase tracking-widest">
              <span class="material-symbols-outlined text-primary text-xl">sensors</span>
              Browser Alerts
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-6 bg-surface-container rounded-lg border border-outline-variant/5 transition-colors hover:bg-surface-container/60">
                <div class="font-body">
                  <p class="font-bold text-on-surface text-sm uppercase tracking-tight">Window Notifications</p>
                  <p class="text-[11px] text-on-surface-variant mt-1">Enable desktop notifications for significant mission updates.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="notifications" class="sr-only peer">
                  <div class="w-10 h-5 bg-surface-container-highest rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-6 bg-surface-container rounded-lg border border-outline-variant/5 transition-colors hover:bg-surface-container/60">
                <div class="font-body">
                  <p class="font-bold text-on-surface text-sm uppercase tracking-tight">Telemetry Sounds</p>
                  <p class="text-[11px] text-on-surface-variant mt-1">Play interface audio feedback during state changes.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="sounds" class="sr-only peer">
                  <div class="w-10 h-5 bg-surface-container-highest rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-6 bg-surface-container rounded-lg border border-outline-variant/5 transition-colors hover:bg-surface-container/60">
                <div class="font-body">
                  <p class="font-bold text-on-surface text-sm uppercase tracking-tight">Auto-Refresh</p>
                  <p class="text-[11px] text-on-surface-variant mt-1">Keep data streams active when tab is in background.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="autoRefresh" class="sr-only peer">
                  <div class="w-10 h-5 bg-surface-container-highest rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Agency Subscriptions (Side Card) -->
        <div class="md:col-span-4 bg-surface-container-low p-8 rounded-xl border border-outline-variant/5 flex flex-col">
          <h3 class="text-sm font-black mb-10 flex items-center gap-3 font-headline uppercase tracking-widest">
            <span class="material-symbols-outlined text-primary text-xl">hub</span>
            Display Nodes
          </h3>
          <div class="space-y-2 font-label uppercase text-[9px] font-bold tracking-widest">
            <button class="w-full flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20 text-primary text-left hover:bg-primary/20 transition-all">
              NASA Deep Space
              <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </button>
            <button class="w-full flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/5 text-on-surface-variant text-left hover:border-primary/30 transition-all">
              SpaceX Network
              <span class="material-symbols-outlined text-sm">add_circle</span>
            </button>
            <button class="w-full flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20 text-primary text-left hover:bg-primary/20 transition-all">
              ESA Observation
              <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </button>
          </div>
          <div class="mt-auto pt-8">
            <div class="h-32 rounded-lg bg-surface-container-highest relative overflow-hidden ring-1 ring-inset ring-outline-variant/10">
              <img alt="Network" class="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"/>
              <div class="absolute inset-0 flex flex-col items-center justify-center p-4">
                <p class="text-[9px] uppercase tracking-[0.3em] text-center text-primary font-black mb-1 font-label">Coverage Status</p>
                <p class="text-[10px] font-bold text-center tracking-tight font-headline">ENCRYPTED TUNNEL ACTIVE</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Metrics & Units -->
        <div class="md:col-span-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
          <h3 class="text-sm font-black mb-10 flex items-center gap-3 font-headline uppercase tracking-widest">
            <span class="material-symbols-outlined text-primary text-xl">straighten</span>
            Data Localization
          </h3>
          <div class="grid grid-cols-2 gap-4 font-headline uppercase font-black tracking-widest text-lg">
            <button @click="units = 'metric'" :class="[
              'p-8 rounded-lg flex flex-col items-center justify-center text-center transition-all',
              units === 'metric' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            ]">
              METRIC
              <span class="text-[9px] mt-2 opacity-60 font-label tracking-widest font-bold">Standard</span>
            </button>
            <button @click="units = 'imperial'" :class="[
              'p-8 rounded-lg flex flex-col items-center justify-center text-center transition-all',
              units === 'imperial' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            ]">
              IMPERIAL
              <span class="text-[9px] mt-2 opacity-60 font-label tracking-widest font-bold">Historic</span>
            </button>
          </div>
        </div>

        <!-- Visual Mode -->
        <div class="md:col-span-6 bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
          <h3 class="text-sm font-black mb-10 flex items-center gap-3 font-headline uppercase tracking-widest">
            <span class="material-symbols-outlined text-primary text-xl">visibility</span>
            Interface Theme
          </h3>
          <div class="grid grid-cols-2 gap-4 font-headline uppercase font-black tracking-widest text-sm">
            <button @click="theme = 'deep-space'" :class="[
              'p-8 rounded-lg flex flex-col items-center justify-center text-center transition-all border-2',
              theme === 'deep-space' ? 'bg-surface-container-lowest border-primary text-on-surface' : 'bg-surface-container border-transparent text-on-surface-variant hover:text-on-surface'
            ]">
              <div class="w-10 h-1.5 bg-surface border border-outline-variant/20 rounded-full mb-4"></div>
              DEEP SPACE
            </button>
            <button @click="theme = 'nebula'" :class="[
              'p-8 rounded-lg flex flex-col items-center justify-center text-center transition-all border-2',
              theme === 'nebula' ? 'bg-surface-container-lowest border-primary text-on-surface' : 'bg-surface-container border-transparent text-on-surface-variant hover:text-on-surface'
            ]">
              <div class="w-10 h-1.5 bg-primary shadow-[0_0_10px_rgba(11,61,145,0.6)] rounded-full mb-4"></div>
              NEBULA
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="mt-16 pt-8 border-t border-outline-variant/10 flex flex-nowrap justify-end gap-6 items-center">
        <button class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors font-label">Clear Browser Cache</button>
        <button class="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-on-primary rounded-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all font-label">Apply Preferences</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.mission-text-stroke {
  color: transparent;
  -webkit-text-stroke: 1.5px #0B3D91;
}
</style>
