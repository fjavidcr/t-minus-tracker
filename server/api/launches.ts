export default defineCachedEventHandler(async () => {
  try {
    const response = await $fetch<{ results: any[] }>('https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10', {
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
  maxAge: import.meta.dev ? 3600 : 60 * 60, // 1 hour in both dev and prod
  swr: true, // Use stale-while-revalidate
  name: 'launches'
});
