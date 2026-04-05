import { CACHE_POLICY } from '~/lib/constants';

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Mission ID is required'
    })
  }

  try {
    const response = await $fetch(`https://ll.thespacedevs.com/2.3.0/launches/${id}/?mode=detailed`, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json'
      }
    })
    return {
      data: response,
      cachedAt: Date.now()
    };
  } catch (error: any) {
    console.error('Error fetching launch details:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Failed to fetch mission details from SpaceDevs'
    })
  }
}, {
  maxAge: CACHE_POLICY.MAX_AGE.DETAIL,
  swr: true,
  name: 'mission-detail'
})
