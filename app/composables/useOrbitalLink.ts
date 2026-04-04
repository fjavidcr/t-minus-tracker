import { useState } from '#app'
import { ref } from 'vue'

interface OrbitalLinkState {
  pending: boolean    // Visual: Should show the rocket (after 500ms)
  connecting: boolean // Immediate: Fetch is in progress (keeps UI dark)
  error: any | null
}

// Global (singletons) for timer and refresh callback
const _refreshCallback = ref<(() => any) | null>(null)
let _pendingTimer: any = null

export const useOrbitalLink = () => {
  // Serialized state (data only)
  const state = useState<OrbitalLinkState>('orbital-link-state', () => ({
    pending: false,
    connecting: false,
    error: null
  }))

  /**
   * Sets the status of the orbital link.
   * @param pending - If the fetch is currently pending.
   * @param error - Any error caught during the fetch.
   * @param refresh - The refresh function (client-side only).
   */
  const setStatus = (pending: boolean, error: any = null, refresh: any = null) => {
    // If we are pending, we ignore any existing error (it's from a previous attempt)
    if (pending) {
      if (_pendingTimer) {
        // Timer already running, don't restart
      } else if (import.meta.client && !state.value.pending) {
        _pendingTimer = setTimeout(() => {
          state.value.pending = true
          _pendingTimer = null
        }, 500)
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
    state.value.pending = false
    state.value.connecting = false
    state.value.error = null
    
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
    state,
    refresh: _refreshCallback,
    setStatus,
    clearError
  }
}
