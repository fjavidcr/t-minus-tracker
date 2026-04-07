/**
 * Global application constants for the Orbitar (T-minus) experience.
 */

export const UI_CONFIG = {
  /**
   * Default fallback assets
   */
  ASSETS: {
    DEFAULT_LAUNCH_IMAGE:
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80',
    DEFAULT_MISSION_IMAGE:
      'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80',
    DEFAULT_ROCKET_IMAGE:
      'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80'
  },

  /**
   * Intervals for reactive timers (in ms)
   */
  INTERVALS: {
    COUNTDOWN: 1000,
    UI_REFRESH: 60000
  },

  /**
   * Layout & Interaction thresholds
   */
  THRESHOLDS: {
    MISSION_URGENCY_DAYS: 3,
    STICKY_HEADER: 480
  }
} as const

export const ORBITAL_LINK_CONFIG = {
  /**
   * Minimum duration in ms of the initial cinematic loading sequence on first load.
   * Ensures the user experiences the premium "launch" feel even if data is cached/SSR'd.
   */
  INITIAL_CINEMATIC_DELAY: 1500,

  /**
   * Delay in ms before the rocket loading state activates during standard data fetching.
   * Prevents "flicker" on fast connections.
   */
  PENDING_TRANSITION_DELAY: 500
} as const

export const CACHE_POLICY = {
  /**
   * Cache duration in seconds.
   */
  MAX_AGE: {
    DEFAULT: import.meta.dev ? 3600 : 3600, // 1 hour
    DETAIL: import.meta.dev ? 3600 : 300, // 5 minutes
    LAUNCHES: import.meta.dev ? 3600 : 600, // 10 minutes
    MISSIONS: import.meta.dev ? 3600 : 1800 // 30 minutes
  }
} as const
