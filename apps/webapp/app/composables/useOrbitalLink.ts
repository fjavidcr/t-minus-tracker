import { useState } from '#app'
import { ref } from 'vue'

import { ORBITAL_LINK_CONFIG } from '../lib/constants'

export interface OrbitalError {
  cause?: unknown
  statusCode?: number
  statusMessage?: string
  url?: string
}

interface OrbitalLinkState {
  connecting: boolean // Immediate: Fetch is in progress (keeps UI dark)
  error: null | OrbitalError
  pending: boolean // Visual: Should show the rocket (after 500ms)
}

// Global (singletons) for timer and refresh callback
const _refreshCallback = ref<(() => Promise<void> | void) | null>(null)
let _pendingTimer: null | ReturnType<typeof setTimeout> = null

export const useOrbitalLink = () => {
  const state = useState<OrbitalLinkState>('orbital-link-state', () => ({
    connecting: true,
    error: null,
    pending: true // Start as pending for the cinematic load
  }))

  // Track if we have already performed the initial client-side link
  const isInitialLink = ref(true)

  /**
   * Sets the status of the orbital link.
   * @param pending - If the fetch is currently pending.
   * @param error - Any error caught during the fetch.
   * @param refresh - The refresh function (client-side only).
   */
  const setStatus = (
    pending: boolean,
    error: null | OrbitalError = null,
    refresh: (() => Promise<void> | void) | null = null
  ) => {
    // If we are pending, we ignore any existing error (it's from a previous attempt)
    if (pending) {
      if (_pendingTimer) {
        // Timer already running, don't restart
      } else if (import.meta.client && !state.value.pending) {
        _pendingTimer = setTimeout(() => {
          state.value.pending = true
          _pendingTimer = null
        }, ORBITAL_LINK_CONFIG.PENDING_TRANSITION_DELAY)
      } else if (!import.meta.client) {
        state.value.pending = true
      }

      state.value.connecting = true
      state.value.error = null // Clear previous error immediately
      if (import.meta.client && refresh) _refreshCallback.value = refresh
      return
    }

    // Handle explicit errors (only if not pending)
    if (error) {
      if (_pendingTimer) {
        clearTimeout(_pendingTimer)
        _pendingTimer = null
      }
      state.value.error = error
      state.value.pending = false
      state.value.connecting = false
      if (import.meta.client && refresh) _refreshCallback.value = refresh
      return
    }

    // Success state (not pending, no error)
    if (_pendingTimer) {
      clearTimeout(_pendingTimer)
      _pendingTimer = null
    }

    // On the very first client-side "ready", we might want to delay it slightly
    // to ensure the Rocket Loading has enough time to show its cinematic animation.
    if (import.meta.client && isInitialLink.value) {
      isInitialLink.value = false
      setTimeout(() => {
        state.value.pending = false
        state.value.connecting = false
        state.value.error = null
      }, ORBITAL_LINK_CONFIG.INITIAL_CINEMATIC_DELAY)
    } else {
      state.value.pending = false
      state.value.connecting = false
      state.value.error = null
    }

    // Update refresh callback if provided
    if (import.meta.client && refresh) {
      _refreshCallback.value = refresh
    }
  }

  const clearError = () => {
    state.value.error = null
    state.value.connecting = false
    state.value.pending = false
    if (_pendingTimer) {
      clearTimeout(_pendingTimer)
      _pendingTimer = null
    }
    _refreshCallback.value = null
  }

  return {
    clearError,
    refresh: _refreshCallback,
    setStatus,
    state
  }
}
