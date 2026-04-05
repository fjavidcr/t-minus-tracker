import { CACHE_POLICY } from '~/lib/constants';

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = query.limit || 12
  const offset = query.offset || 0

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
