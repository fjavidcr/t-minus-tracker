import { CACHE_POLICY } from '~/lib/constants'

const USE_CACHE = true // Cambia a true para activar la caché de Nitro

const handler = defineEventHandler(async (event) => {
  // 1. Input Validation
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 10
  const offset = parseInt(query.offset as string) || 0

  // Sanity checks
  if (limit < 1 || limit > 50 || isNaN(limit)) {
    throw createError({ message: 'Invalid limit parameter. Range: 1-50.', statusCode: 400 })
  }
  if (offset < 0 || isNaN(offset)) {
    throw createError({ message: 'Invalid offset parameter.', statusCode: 400 })
  }

  // Artificial delay to test loading states (RocketLoading)
  // Solo se ejecutará si USE_CACHE es false o si la caché ha expirado
  if (import.meta.dev) {
    await new Promise((resolve) => setTimeout(resolve, 3000)) // 3 segundos para ver el cohete
  }

  try {
    const response = await $fetch<{ results: Record<string, unknown>[] }>(
      `https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=${limit}&offset=${offset}&mode=detailed`,
      {
        headers: {
          Accept: 'application/json'
        },
        timeout: 5000
      }
    )
    return {
      cachedAt: Date.now(),
      data: response.results
    }
  } catch (err: unknown) {
    const error = err as { response?: { status?: number } }
    console.error('Error fetching launches from SpaceDevs:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Unable to establish orbital link with SpaceDevs arrays.'
    })
  }
})

export default USE_CACHE
  ? defineCachedEventHandler(handler, {
      maxAge: CACHE_POLICY.MAX_AGE.LAUCHES,
      name: 'launches',
      swr: true
    })
  : handler
