<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  error: any;
  retry?: (() => any) | null;
}>();

const errorStatus = computed(() => {
  return props.error?.statusCode || 500;
});

const errorMessage = computed(() => {
  return props.error?.statusMessage || 'Unknown interference in orbital uplink.';
});

const diagnostics = computed(() => {
  const parts = [];
  if (props.error?.url) parts.push(`TARGET: ${props.error.url}`);
  if (props.error?.cause) parts.push(`CAUSE: ${props.error.cause}`);
  return parts.length > 0 ? parts.join('\n') : 'NO FURTHER DATA AVAILABLE';
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] py-12 px-6 text-center">
    <div class="relative w-full max-w-2xl bg-[#0a0d14] border border-secondary/30 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(252,61,33,0.15)]">
      <!-- Terminal Header -->
      <div class="bg-surface-container-low border-b border-secondary/20 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary/50"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-secondary/30"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-secondary/10"></span>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary font-label">Orbital Link Status: Terminated</span>
        </div>
        <span class="text-[10px] font-bold text-on-surface-variant/40 font-mono italic">COM-ID: ERR_{{ errorStatus }}</span>
      </div>

      <!-- Terminal Body -->
      <div class="p-8 md:p-12 space-y-10 relative">
        <!-- Grid Background -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#Fc3d21 0.5px, transparent 0.5px); background-size: 20px 20px;"></div>

        <div class="space-y-6 relative z-10">
          <h2 class="text-4xl md:text-5xl font-black text-secondary tracking-tighter uppercase glitch-text font-headline" :data-text="`SIGNAL_LOST_${errorStatus}`">
            SIGNAL_LOST_{{ errorStatus }}
          </h2>
          
          <div class="space-y-2">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant font-label">Transmission Error</p>
            <p class="text-lg font-medium text-on-surface leading-snug max-w-md mx-auto">
              {{ errorMessage }}
            </p>
          </div>
        </div>

        <div class="bg-black/40 border border-secondary/10 p-6 rounded-lg text-left font-mono space-y-4">
          <div class="flex items-center justify-between border-b border-secondary/10 pb-3 mb-2">
            <span class="text-[9px] font-bold uppercase tracking-widest text-secondary opacity-60">System Diagnostics</span>
            <span class="text-[9px] text-on-surface-variant/40 italic">Buffer: 4096KB</span>
          </div>
          <pre class="text-[10px] leading-relaxed text-on-surface-variant/80 whitespace-pre-wrap break-all uppercase">
{{ diagnostics }}
> ATTEMPTING_HANDSHAKE... FAIL
> PACKET_LOSS_DETECTION... 100%
> CARRIER_WAVE... OFFLINE
          </pre>
        </div>

        <div class="pt-6 relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            @click="retry ? retry() : null"
            class="group bg-secondary text-white px-10 py-5 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary/80 hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(252,61,33,0.4)] flex items-center gap-4 font-label"
          >
            <span class="material-symbols-outlined text-sm animate-spin-slow">refresh</span>
            Re-establish Link
          </button>
          
          <NuxtLink 
            to="/" 
            class="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-white transition-colors border-b border-transparent hover:border-on-surface-variant font-label"
          >
            Return to Base Dashboard
          </NuxtLink>
        </div>
      </div>

      <!-- Scaning Line Effect -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden origin-top animate-scanline opacity-20">
        <div class="w-full h-[2px] bg-secondary shadow-[0_0_10px_#Fc3d21]"></div>
      </div>
    </div>

    <!-- Alert Footer -->
    <p class="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-error/40 flex items-center gap-3">
      <span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
      Critical Uplink Error Detected
      <span class="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
    </p>
  </div>
</template>

<style scoped>
.glitch-text {
  position: relative;
  text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
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
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  14% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  15% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  49% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  50% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  99% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  100% {
    text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
}

@keyframes scanline {
  0% { transform: translateY(0); opacity: 0; }
  5% { opacity: 0.5; }
  95% { opacity: 0.5; }
  100% { transform: translateY(500px); opacity: 0; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
