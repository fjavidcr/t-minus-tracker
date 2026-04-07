import { CACHE_POLICY } from '~/lib/constants'

export default defineCachedEventHandler(
  async (event) => {
    const query = getQuery(event)

    // 1. Strict Input Validation
    const limit = parseInt(query.limit as string) || 12
    const offset = parseInt(query.offset as string) || 0
    const agency = query.agency ? String(query.agency) : undefined

    if (limit < 1 || limit > 50 || isNaN(limit)) {
      throw createError({
        message: 'Orbital limit must be between 1 and 50 nodes.',
        statusCode: 400
      })
    }
    if (offset < 0 || isNaN(offset)) {
      throw createError({ message: 'Invalid temporal offset detected.', statusCode: 400 })
    }
    if (agency && !/^\d+$/.test(agency)) {
      throw createError({ message: 'Invalid agency identifier format.', statusCode: 400 })
    }

    try {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })

      const response = await $fetch<{
        count: number
        next: null | string
        previous: null | string
        results: Record<string, unknown>[]
      }>(`https://ll.thespacedevs.com/2.3.0/launches/upcoming/?${params.toString()}`, {
        headers: {
          Accept: 'application/json'
        },
        timeout: 5000
      })
      return {
        cachedAt: Date.now(),
        data: response
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      console.error('Error fetching mission archive from SpaceDevs:', error)
      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: 'Unable to retrieve mission records from orbital data nodes.'
      })
    }
  },
  {
    getKey: (event) => event.path,
    maxAge: CACHE_POLICY.MAX_AGE.MISSIONS,
    name: 'missions-archive',
    swr: true
  }
)
