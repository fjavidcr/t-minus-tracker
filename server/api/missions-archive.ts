export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = query.limit || 12
  const offset = query.offset || 0

  try {
    const response = await $fetch<{ count: number, next: string, previous: string, results: any[] }>(`https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=${limit}&offset=${offset}`, {
      headers: {
        'Accept': 'application/json',
      }
    })
    return response
  } catch (error) {
    console.error('Error fetching mission archive from SpaceDevs:', error)
    return { count: 0, next: null, previous: null, results: [] }
  }
}, {
  maxAge: import.meta.dev ? 3600 : 600, // 10 minutes in prod, 1 hour in dev
  swr: true,
  name: 'missions-archive',
  getKey: (event) => event.path
})
