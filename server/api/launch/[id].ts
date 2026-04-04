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
      timeout: 5000,
      headers: {
        'Accept': 'application/json'
      }
    })
    return response
  } catch (error: any) {
    console.error('Error fetching launch details:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Failed to fetch mission details from SpaceDevs'
    })
  }
}, {
  maxAge: import.meta.dev ? 3600 : 300, // 5 minutes in prod, 1 hour in dev
  swr: true,
  name: 'mission-detail'
})
