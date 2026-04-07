import type { UseFetchOptions } from '#app'

import { useFetch, useState } from '#app'

export function useSecureFetch<T>(url: (() => string) | string, options: UseFetchOptions<T> = {}) {
  const secureToken = useState<null | string>('secureToken')

  // Create headers if not provided
  const headers = (options.headers || {}) as Record<string, string>

  // Add custom security headers
  headers['x-orbital-client'] = 'true'
  if (secureToken.value) {
    headers['x-secure-token'] = secureToken.value
  }

  return useFetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers // Explicitly passed headers take precedence
    }
  })
}
