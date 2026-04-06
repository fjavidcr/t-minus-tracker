import { CACHE_POLICY } from '~/lib/constants';

const USE_CACHE = true; // Cambia a true para activar la caché de Nitro

const handler = defineEventHandler(async (event) => {
  // 1. Input Validation
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 10;
  const offset = parseInt(query.offset as string) || 0;

  // Sanity checks
  if (limit < 1 || limit > 50 || isNaN(limit)) {
    throw createError({ statusCode: 400, message: 'Invalid limit parameter. Range: 1-50.' });
  }
  if (offset < 0 || isNaN(offset)) {
    throw createError({ statusCode: 400, message: 'Invalid offset parameter.' });
  }

  // Artificial delay to test loading states (RocketLoading)
  // Solo se ejecutará si USE_CACHE es false o si la caché ha expirado
  if (import.meta.dev) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 segundos para ver el cohete
  }

  try {
    const response = await $fetch<{ results: any[] }>(`https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=${limit}&offset=${offset}&mode=detailed`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      }
    });
    return {
      data: response.results,
      cachedAt: Date.now()
    };
  } catch (error: any) {
    console.error('Error fetching launches from SpaceDevs:', error);
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Unable to establish orbital link with SpaceDevs arrays.'
    });
  }
});

export default USE_CACHE
  ? defineCachedEventHandler(handler, {
      maxAge: CACHE_POLICY.MAX_AGE.LAUCHES,
      swr: true,
      name: 'launches'
    })
  : handler;
