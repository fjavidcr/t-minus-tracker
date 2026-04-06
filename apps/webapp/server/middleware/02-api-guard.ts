export default defineEventHandler((event) => {
  const path = event.path;

  // Protect all /api/ paths except for any that should be public
  if (path.startsWith('/api/')) {
    // Check if it's an internal API call from our own client
    validateApiRequest(event);
  }
});
