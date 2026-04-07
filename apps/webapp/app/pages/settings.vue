<script setup lang="ts">
useHead({
  title: 'System Settings - T-minus'
})

const notifications = ref(true)
const sounds = ref(true)
const autoRefresh = ref(false)
const units = ref('metric')
const theme = ref('deep-space')
</script>

<template>
  <main class="bg-surface flex min-h-[calc(100vh-80px)] flex-1 flex-col overflow-x-hidden">
    <!-- Page Content: Settings Console -->
    <div class="mx-auto w-full max-w-6xl p-8 md:p-12">
      <!-- Header Section -->
      <div class="mb-16">
        <span
          class="font-label label-md text-primary text-[10px] font-black uppercase tracking-[0.4em]"
          >Environment Matrix / v4.0</span
        >
        <h1
          class="text-on-surface font-headline mb-4 mt-2 text-5xl font-black uppercase leading-none tracking-tighter"
        >
          Console <span class="text-primary-container mission-text-stroke">Settings</span>
        </h1>
        <p class="text-on-surface-variant font-body max-w-2xl text-sm leading-relaxed">
          Configure your local browser environment. These parameters are stored locally and do not
          affect mission telemetry.
        </p>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-12">
        <!-- Notification Presets (Large Card) -->
        <div
          class="bg-surface-container-low border-outline-variant/5 group relative overflow-hidden rounded-xl border p-8 md:col-span-8"
        >
          <div class="relative z-10">
            <h3
              class="font-headline mb-10 flex items-center gap-3 text-sm font-black uppercase tracking-widest"
            >
              <span class="material-symbols-outlined text-primary text-xl">sensors</span>
              Browser Alerts
            </h3>
            <div class="space-y-4">
              <div
                class="bg-surface-container border-outline-variant/5 hover:bg-surface-container/60 flex items-center justify-between rounded-lg border p-6 transition-colors"
              >
                <div class="font-body">
                  <p class="text-on-surface text-sm font-bold uppercase tracking-tight">
                    Window Notifications
                  </p>
                  <p class="text-on-surface-variant mt-1 text-[11px]">
                    Enable desktop notifications for significant mission updates.
                  </p>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input v-model="notifications" type="checkbox" class="peer sr-only" />
                  <div
                    class="bg-surface-container-highest peer-checked:bg-primary peer h-5 w-10 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>

              <div
                class="bg-surface-container border-outline-variant/5 hover:bg-surface-container/60 flex items-center justify-between rounded-lg border p-6 transition-colors"
              >
                <div class="font-body">
                  <p class="text-on-surface text-sm font-bold uppercase tracking-tight">
                    Telemetry Sounds
                  </p>
                  <p class="text-on-surface-variant mt-1 text-[11px]">
                    Play interface audio feedback during state changes.
                  </p>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input v-model="sounds" type="checkbox" class="peer sr-only" />
                  <div
                    class="bg-surface-container-highest peer-checked:bg-primary peer h-5 w-10 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>

              <div
                class="bg-surface-container border-outline-variant/5 hover:bg-surface-container/60 flex items-center justify-between rounded-lg border p-6 transition-colors"
              >
                <div class="font-body">
                  <p class="text-on-surface text-sm font-bold uppercase tracking-tight">
                    Auto-Refresh
                  </p>
                  <p class="text-on-surface-variant mt-1 text-[11px]">
                    Keep data streams active when tab is in background.
                  </p>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input v-model="autoRefresh" type="checkbox" class="peer sr-only" />
                  <div
                    class="bg-surface-container-highest peer-checked:bg-primary peer h-5 w-10 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Agency Subscriptions (Side Card) -->
        <div
          class="bg-surface-container-low border-outline-variant/5 flex flex-col rounded-xl border p-8 md:col-span-4"
        >
          <h3
            class="font-headline mb-10 flex items-center gap-3 text-sm font-black uppercase tracking-widest"
          >
            <span class="material-symbols-outlined text-primary text-xl">hub</span>
            Display Nodes
          </h3>
          <div class="font-label space-y-2 text-[9px] font-bold uppercase tracking-widest">
            <button
              class="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all"
            >
              NASA Deep Space
              <span
                class="material-symbols-outlined text-sm"
                style="font-variation-settings: 'FILL' 1"
                >check_circle</span
              >
            </button>
            <button
              class="bg-surface-container border-outline-variant/5 text-on-surface-variant hover:border-primary/30 flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all"
            >
              SpaceX Network
              <span class="material-symbols-outlined text-sm">add_circle</span>
            </button>
            <button
              class="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all"
            >
              ESA Observation
              <span
                class="material-symbols-outlined text-sm"
                style="font-variation-settings: 'FILL' 1"
                >check_circle</span
              >
            </button>
          </div>
          <div class="mt-auto pt-8">
            <div
              class="bg-surface-container-highest ring-outline-variant/10 relative h-32 overflow-hidden rounded-lg ring-1 ring-inset"
            >
              <img
                alt="Network"
                class="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
              />
              <div class="absolute inset-0 flex flex-col items-center justify-center p-4">
                <p
                  class="text-primary font-label mb-1 text-center text-[9px] font-black uppercase tracking-[0.3em]"
                >
                  Coverage Status
                </p>
                <p class="font-headline text-center text-[10px] font-bold tracking-tight">
                  ENCRYPTED TUNNEL ACTIVE
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Metrics & Units -->
        <div
          class="bg-surface-container-low border-outline-variant/5 rounded-xl border p-8 md:col-span-6"
        >
          <h3
            class="font-headline mb-10 flex items-center gap-3 text-sm font-black uppercase tracking-widest"
          >
            <span class="material-symbols-outlined text-primary text-xl">straighten</span>
            Data Localization
          </h3>
          <div
            class="font-headline grid grid-cols-2 gap-4 text-lg font-black uppercase tracking-widest"
          >
            <button
              :class="[
                'flex flex-col items-center justify-center rounded-lg p-8 text-center transition-all',
                units === 'metric'
                  ? 'bg-primary text-on-primary shadow-primary/20 shadow-lg'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              ]"
              @click="units = 'metric'"
            >
              METRIC
              <span class="font-label mt-2 text-[9px] font-bold tracking-widest opacity-60"
                >Standard</span
              >
            </button>
            <button
              :class="[
                'flex flex-col items-center justify-center rounded-lg p-8 text-center transition-all',
                units === 'imperial'
                  ? 'bg-primary text-on-primary shadow-primary/20 shadow-lg'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              ]"
              @click="units = 'imperial'"
            >
              IMPERIAL
              <span class="font-label mt-2 text-[9px] font-bold tracking-widest opacity-60"
                >Historic</span
              >
            </button>
          </div>
        </div>

        <!-- Visual Mode -->
        <div
          class="bg-surface-container-low border-outline-variant/5 rounded-xl border p-8 md:col-span-6"
        >
          <h3
            class="font-headline mb-10 flex items-center gap-3 text-sm font-black uppercase tracking-widest"
          >
            <span class="material-symbols-outlined text-primary text-xl">visibility</span>
            Interface Theme
          </h3>
          <div
            class="font-headline grid grid-cols-2 gap-4 text-sm font-black uppercase tracking-widest"
          >
            <button
              :class="[
                'flex flex-col items-center justify-center rounded-lg border-2 p-8 text-center transition-all',
                theme === 'deep-space'
                  ? 'bg-surface-container-lowest border-primary text-on-surface'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-transparent'
              ]"
              @click="theme = 'deep-space'"
            >
              <div
                class="bg-surface border-outline-variant/20 mb-4 h-1.5 w-10 rounded-full border"
              ></div>
              DEEP SPACE
            </button>
            <button
              :class="[
                'flex flex-col items-center justify-center rounded-lg border-2 p-8 text-center transition-all',
                theme === 'nebula'
                  ? 'bg-surface-container-lowest border-primary text-on-surface'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-transparent'
              ]"
              @click="theme = 'nebula'"
            >
              <div
                class="bg-primary mb-4 h-1.5 w-10 rounded-full shadow-[0_0_10px_rgba(11,61,145,0.6)]"
              ></div>
              NEBULA
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div
        class="border-outline-variant/10 mt-16 flex flex-nowrap items-center justify-end gap-6 border-t pt-8"
      >
        <button
          class="text-on-surface-variant hover:text-primary font-label text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
        >
          Clear Browser Cache
        </button>
        <button
          class="bg-primary text-on-primary shadow-primary/20 font-label rounded-lg px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:brightness-110 active:scale-[0.98]"
        >
          Apply Preferences
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.mission-text-stroke {
  color: transparent;
  -webkit-text-stroke: 1.5px #0b3d91;
}
</style>
