export default defineCachedEventHandler(async () => {
  try {
    const response = await $fetch<{ results: any[] }>('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10', {
      headers: {
        'Accept': 'application/json',
      }
    });
    return response.results;
  } catch (error) {
    console.error('Error fetching launches from SpaceDevs:', error);
    // Return empty array on failure
    return [];
  }
}, {
  maxAge: 60 * 60, // Cache for 1 hour
  swr: true, // Use stale-while-revalidate
  name: 'launches'
});
