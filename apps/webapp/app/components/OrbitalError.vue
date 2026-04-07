<script setup lang="ts">
import { computed } from 'vue'

interface OrbitalError {
  cause?: unknown
  statusCode?: number
  statusMessage?: string
  url?: string
}

const props = defineProps<{
  error: OrbitalError
  retry?: (() => void) | null
}>()

const errorStatus = computed(() => {
  return props.error?.statusCode || 500
})

const errorMessage = computed(() => {
  return props.error?.statusMessage || 'Unknown interference in orbital uplink.'
})

const diagnostics = computed(() => {
  const parts = []
  if (props.error?.url) parts.push(`TARGET: ${props.error.url}`)
  if (props.error?.cause) parts.push(`CAUSE: ${props.error.cause}`)
  return parts.length > 0 ? parts.join('\n') : 'NO FURTHER DATA AVAILABLE'
})
</script>

<template>
  <div class="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center">
    <div
      class="border-secondary/30 relative w-full max-w-2xl overflow-hidden rounded-xl border bg-[#0a0d14] shadow-[0_20px_50px_rgba(252,61,33,0.15)]"
    >
      <!-- Terminal Header -->
      <div
        class="bg-surface-container-low border-secondary/20 flex items-center justify-between border-b px-6 py-4"
      >
        <div class="flex items-center gap-4">
          <div class="flex gap-1.5">
            <span class="bg-secondary/50 h-2.5 w-2.5 rounded-full"></span>
            <span class="bg-secondary/30 h-2.5 w-2.5 rounded-full"></span>
            <span class="bg-secondary/10 h-2.5 w-2.5 rounded-full"></span>
          </div>
          <span class="text-secondary font-label text-[10px] font-bold uppercase tracking-[0.2em]"
            >Orbital Link Status: Terminated</span
          >
        </div>
        <span class="text-on-surface-variant/40 font-mono text-[10px] font-bold italic"
          >COM-ID: ERR_{{ errorStatus }}</span
        >
      </div>

      <!-- Terminal Body -->
      <div class="relative space-y-10 p-8 md:p-12">
        <!-- Grid Background -->
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.03]"
          style="
            background-image: radial-gradient(#fc3d21 0.5px, transparent 0.5px);
            background-size: 20px 20px;
          "
        ></div>

        <div class="relative z-10 space-y-6">
          <h2
            class="text-secondary glitch-text font-headline text-4xl font-black uppercase tracking-tighter md:text-5xl"
            :data-text="`SIGNAL_LOST_${errorStatus}`"
          >
            SIGNAL_LOST_{{ errorStatus }}
          </h2>

          <div class="space-y-2">
            <p
              class="text-on-surface-variant font-label text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Transmission Error
            </p>
            <p class="text-on-surface mx-auto max-w-md text-lg font-medium leading-snug">
              {{ errorMessage }}
            </p>
          </div>
        </div>

        <div
          class="border-secondary/10 space-y-4 rounded-lg border bg-black/40 p-6 text-left font-mono"
        >
          <div class="border-secondary/10 mb-2 flex items-center justify-between border-b pb-3">
            <span class="text-secondary text-[9px] font-bold uppercase tracking-widest opacity-60"
              >System Diagnostics</span
            >
            <span class="text-on-surface-variant/40 text-[9px] italic">Buffer: 4096KB</span>
          </div>
          <pre
            class="text-on-surface-variant/80 whitespace-pre-wrap break-all text-[10px] uppercase leading-relaxed"
            >{{ diagnostics }}
> ATTEMPTING_HANDSHAKE... FAIL
> PACKET_LOSS_DETECTION... 100%
> CARRIER_WAVE... OFFLINE
          </pre>
        </div>

        <div class="relative z-10 flex flex-col items-center justify-center gap-6 pt-6 md:flex-row">
          <button
            class="bg-secondary hover:bg-secondary/80 font-label group flex items-center gap-4 rounded-lg px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-[0_0_30px_rgba(252,61,33,0.4)] transition-all hover:scale-105 active:scale-95"
            @click="retry ? retry() : null"
          >
            <span class="material-symbols-outlined animate-spin-slow text-sm">refresh</span>
            Re-establish Link
          </button>

          <NuxtLink
            to="/"
            class="text-on-surface-variant hover:border-on-surface-variant font-label border-b border-transparent text-[9px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-white"
          >
            Return to Base Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Scaning Line Effect -->
      <div
        class="animate-scanline pointer-events-none absolute inset-0 origin-top overflow-hidden opacity-20"
      >
        <div class="bg-secondary h-[2px] w-full shadow-[0_0_10px_#Fc3d21]"></div>
      </div>
    </div>

    <!-- Alert Footer -->
    <p
      class="text-error/40 mt-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em]"
    >
      <span class="bg-error h-1.5 w-1.5 animate-pulse rounded-full"></span>
      Critical Uplink Error Detected
      <span class="bg-error h-1.5 w-1.5 animate-pulse rounded-full"></span>
    </p>
  </div>
</template>

<style scoped>
.glitch-text {
  position: relative;
  text-shadow:
    0.05em 0 0 rgba(255, 0, 0, 0.75),
    -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
    0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  animation: glitch 500ms infinite;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-text::before {
  animation: glitch 650ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  transform: translate(-0.025em, -0.0125em);
  opacity: 0.8;
}

.glitch-text::after {
  animation: glitch 300ms infinite;
  clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
  transform: translate(0.0125em, 0.025em);
  opacity: 0.8;
}

@keyframes glitch {
  0% {
    text-shadow:
      0.05em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  14% {
    text-shadow:
      0.05em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  15% {
    text-shadow:
      -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  49% {
    text-shadow:
      -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  50% {
    text-shadow:
      0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  99% {
    text-shadow:
      0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  100% {
    text-shadow:
      -0.025em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
}

@keyframes scanline {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  5% {
    opacity: 0.5;
  }
  95% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(500px);
    opacity: 0;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
