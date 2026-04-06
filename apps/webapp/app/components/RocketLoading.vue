<script setup lang="ts">
// Cinematic loading component inspired by NASA Artemis II (SLS)
</script>

<template>
  <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070a] overflow-hidden">
    <!-- Starfield Background -->
    <div class="absolute inset-0 z-0">
      <div v-for="n in 50" :key="n" 
           class="absolute rounded-full bg-white opacity-20 animate-pulse"
           :style="{
             top: Math.random() * 100 + '%',
             left: Math.random() * 100 + '%',
             width: Math.random() * 2 + 'px',
             height: Math.random() * 2 + 'px',
             animationDelay: Math.random() * 3 + 's'
           }">
      </div>
    </div>

    <!-- Atmospheric Glow -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Main Content Container with Vibration -->
    <div class="relative z-10 flex flex-col items-center animate-lift-off">
      
      <!-- Artemis II (SLS) Rocket SVG -->
      <div class="rocket-container relative group">
        <svg viewBox="0 0 100 240" class="w-32 md:w-48 drop-shadow-[0_0_30px_rgba(252,61,33,0.3)]">
          <!-- Launch Abort System (LAS) -->
          <path d="M50 5 L50 25" stroke="#dfe2ee" stroke-width="1" />
          <path d="M48 25 L52 25 L50 15 Z" fill="#dfe2ee" />
          
          <!-- Orion Capsule & ESM -->
          <path d="M46 25 L54 25 L56 35 L44 35 Z" fill="#8e94a5" /> <!-- Orion -->
          <rect x="44" y="35" width="12" height="15" fill="#5c6374" /> <!-- Service Module -->
          
          <!-- SLS Core Stage (Orange Tank) -->
          <path d="M42 50 L58 50 L58 200 L42 200 Z" fill="#D35400" /> <!-- Main Body -->
          <rect x="42" y="190" width="16" height="10" fill="#BA4A00" /> <!-- Base darker section -->
          
          <!-- Detail Lines on Core Stage -->
          <line x1="50" y1="55" x2="50" y2="185" stroke="rgba(0,0,0,0.1)" stroke-width="1" />
          <template v-for="i in 5" :key="i">
            <line :x1="42" :y1="60 + i*30" :x2="58" :y2="60 + i*30" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
          </template>

          <!-- Solid Rocket Boosters (SRBs) -->
          <!-- Left Booster -->
          <path d="M34 85 L40 85 L40 190 L34 190 Z" fill="#FFFFFF" />
          <path d="M34 85 Q37 75 40 85 Z" fill="#FFFFFF" /> <!-- Tip -->
          <rect x="34" y="100" width="6" height="2" fill="#2C3E50" /> <!-- Mark -->
          <rect x="34" y="170" width="6" height="2" fill="#2C3E50" /> <!-- Mark -->
          
          <!-- Right Booster -->
          <path d="M60 85 L66 85 L66 190 L60 190 Z" fill="#FFFFFF" />
          <path d="M60 85 Q63 75 66 85 Z" fill="#FFFFFF" /> <!-- Tip -->
          <rect x="60" y="100" width="6" height="2" fill="#2C3E50" /> <!-- Mark -->
          <rect x="60" y="170" width="6" height="2" fill="#2C3E50" /> <!-- Mark -->

          <!-- Rocket Engines (RS-25) -->
          <path d="M44 200 L46 208 L42 208 Z" fill="#2C3E50" />
          <path d="M49 200 L51 208 L47 208 Z" fill="#2C3E50" />
          <path d="M53 200 L55 208 L51 208 Z" fill="#2C3E50" />
          <path d="M58 200 L60 208 L56 208 Z" fill="#2C3E50" />

          <!-- Improved Elegant Multi-Layered Plasma Exhaust -->
          <g class="exhaust-system">
            <!-- Outer Glow / Vapor (Slow Breathing) -->
            <path d="M30 195 Q50 280 70 195 Z" fill="url(#outerVapor)" class="animate-vapor" />
            
            <!-- Main Flame Body (SRBs + Core) -->
            <path d="M34 190 Q37 250 40 190 Z" fill="url(#srbFlameL)" class="animate-flame-srbs" />
            <path d="M60 190 Q63 250 66 190 Z" fill="url(#srbFlameR)" class="animate-flame-srbs" />
            <path d="M42 200 Q50 270 58 200 Z" fill="url(#coreFlame)" class="animate-flame-main" />
            
            <!-- Super-heated Plasma Core (Integrated) -->
            <path d="M46 200 Q50 230 54 200 Z" fill="white" class="animate-core-glow" />
            <path d="M36 190 Q37 210 38 190 Z" fill="white" class="animate-core-glow" />
            <path d="M62 190 Q63 210 64 190 Z" fill="white" class="animate-core-glow" />
          </g>

          <!-- Gradient Definitions -->
          <defs>
            <radialGradient id="coreFlame" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
              <stop offset="0%" stop-color="#FC3D21" />
              <stop offset="60%" stop-color="#FF5733" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
            <radialGradient id="srbFlameL" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
              <stop offset="0%" stop-color="#FFC300" />
              <stop offset="70%" stop-color="#FC3D21" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
            <radialGradient id="srbFlameR" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
              <stop offset="0%" stop-color="#FFC300" />
              <stop offset="70%" stop-color="#FC3D21" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
            <radialGradient id="outerVapor" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
              <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <!-- Loading Status Text -->
      <div class="mt-8 flex flex-col items-center">
        <h3 class="font-headline text-xs font-black uppercase tracking-[0.6em] text-on-surface/80">
          INITIALIZING ORBITAL LINK...
        </h3>
        
        <!-- Progress Bar -->
        <div class="mt-4 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-primary animate-progress"></div>
        </div>
        
        <p class="mt-4 font-label text-[8px] font-bold uppercase tracking-[0.4em] text-on-surface-variant animate-pulse">
          Signal acquisition in progress...
        </p>
      </div>
    </div>

    <!-- NASA Meatball Watermark (Subtle) -->
    <div class="absolute bottom-12 right-12 opacity-5 scale-75 grayscale invert">
      <svg width="100" height="80" viewBox="0 0 100 80">
        <circle cx="50" cy="40" r="38" fill="white" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.animate-lift-off {
  animation: liftOff 12s ease-in-out infinite;
}

@keyframes liftOff {
  0% { transform: translateY(20px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(20px); }
}

@keyframes shake {
  0% { transform: translate(0.5px, 0.5px) rotate(0deg); }
  20% { transform: translate(-0.5px, 0px) rotate(0.05deg); }
  40% { transform: translate(0.5px, -0.5px) rotate(0deg); }
  60% { transform: translate(-0.5px, 0.5px) rotate(-0.05deg); }
  80% { transform: translate(-0.5px, -0.5px) rotate(0deg); }
  100% { transform: translate(0.5px, 0.5px) rotate(0.05deg); }
}

.animate-flame-srbs {
  animation: elegantPulse 2s ease-in-out infinite;
  transform-origin: top center;
}

.animate-flame-main {
  animation: elegantPulse 3s ease-in-out infinite;
  transform-origin: top center;
}

.animate-vapor {
  animation: vaporPulse 5s ease-in-out infinite;
  transform-origin: top center;
}

.animate-core-glow {
  animation: coreGlow 4s ease-in-out infinite;
  transform-origin: center;
}

@keyframes elegantPulse {
  0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.8; filter: blur(0px); }
  50% { transform: scaleY(1.1) scaleX(1.02); opacity: 1; filter: blur(0.5px); }
}

@keyframes vaporPulse {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.3); opacity: 0.25; }
}

@keyframes coreGlow {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes plasmaCorePulse {
  0%, 100% { transform: scaleY(1); opacity: 0.9; }
  50% { transform: scaleY(1.2); opacity: 1; }
}

.animate-progress {
  animation: progress 3s ease-in-out infinite;
  width: 100%;
  transform-origin: left;
}

@keyframes progress {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
</style>
