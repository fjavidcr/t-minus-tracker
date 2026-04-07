import { CACHE_POLICY } from '~/lib/constants'

export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mission ID is required'
      })
    }

    try {
      const response = await $fetch<Record<string, unknown>>(
        `https://ll.thespacedevs.com/2.3.0/launches/${id}/?mode=detailed`,
        {
          headers: {
            Accept: 'application/json'
          },
          timeout: 15000
        }
      )
      return {
        cachedAt: Date.now(),
        data: response
      }
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; statusText?: string } }
      console.error('Error fetching launch details:', error)
      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage:
          error.response?.statusText || 'Failed to fetch mission details from SpaceDevs'
      })
    }
  },
  {
    maxAge: CACHE_POLICY.MAX_AGE.DETAIL,
    name: 'mission-detail',
    swr: true
  }
)
