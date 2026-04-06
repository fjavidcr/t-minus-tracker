import { CACHE_POLICY } from '~/lib/constants';

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  
  // 1. Strict Input Validation
  const limit = parseInt(query.limit as string) || 12
  const offset = parseInt(query.offset as string) || 0
  const agency = query.agency ? String(query.agency) : undefined

  if (limit < 1 || limit > 50 || isNaN(limit)) {
    throw createError({ statusCode: 400, message: 'Orbital limit must be between 1 and 50 nodes.' })
  }
  if (offset < 0 || isNaN(offset)) {
    throw createError({ statusCode: 400, message: 'Invalid temporal offset detected.' })
  }
  if (agency && !/^\d+$/.test(agency)) {
    throw createError({ statusCode: 400, message: 'Invalid agency identifier format.' })
  }

  try {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    const response = await $fetch<{ count: number, next: string, previous: string, results: any[] }>(`https://ll.thespacedevs.com/2.3.0/launches/upcoming/?${params.toString()}`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      }
    })
    return {
      data: response,
      cachedAt: Date.now()
    };
  } catch (error: any) {
    console.error('Error fetching mission archive from SpaceDevs:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Unable to retrieve mission records from orbital data nodes.'
    });
  }
}, {
  maxAge: CACHE_POLICY.MAX_AGE.MISSIONS,
  swr: true,
  name: 'missions-archive',
  getKey: (event) => event.path
})
