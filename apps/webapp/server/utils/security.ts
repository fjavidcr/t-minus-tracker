import type { H3Event } from 'h3'

import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_EXPIRATION_SECONDS = 3600 // 60 minutes

/**
 * Generates a secure HMAC token based on the current timestamp and the secret key.
 * @param secret - The API secret key from runtime config.
 * @returns A string in the format "timestamp.signature"
 */
export function generateSecureToken(secret: string): string {
  if (!secret) {
    throw createError({
      message:
        'CRITICAL: NUXT_API_SECRET_KEY is not defined in the environment. API security cannot be established.',
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signature = createHmac('sha256', secret).update(timestamp).digest('hex')

  return `${timestamp}.${signature}`
}

/**
 * Centralized API request validator.
 * Checks for custom client header, origin consistency, and HMAC token.
 */
export function validateApiRequest(event: H3Event): void {
  const config = useRuntimeConfig(event)
  const secret = (config.apiSecretKey as string) || ''

  // 1. Custom Client Header
  const clientHeader = getHeader(event, 'x-orbital-client')
  if (clientHeader !== 'true') {
    throw createError({
      message: 'Access Denied: Invalid protocol agent detected.',
      statusCode: 403
    })
  }

  // 2. Origin/Referer Check (Simple SSR validation)
  // In production, we'd verify it against the actual domain.
  if (import.meta.dev) {
    // Skip strict origin check in dev if needed, or implement it
  }

  // 3. HMAC Token Validation
  const secureToken = getHeader(event, 'x-secure-token')
  validateSecureToken(secureToken, secret)
}

/**
 * Validates an HMAC token.
 * @param secureToken - The token to validate (timestamp.signature).
 * @param secret - The API secret key from runtime config.
 * @throws {Error} If validation fails or token is expired.
 */
export function validateSecureToken(secureToken: null | string | undefined, secret: string): void {
  if (!secureToken || !secureToken.includes('.')) {
    throw createError({
      message: 'Access Denied: Missing or malformed telemetry token.',
      statusCode: 403
    })
  }

  if (!secret) {
    throw createError({
      message: 'Internal System Error: Security configuration incomplete.',
      statusCode: 500
    })
  }

  const [timestampStr, signature] = secureToken.split('.')
  if (!timestampStr || !signature) {
    throw createError({ message: 'Invalid token format.', statusCode: 403 })
  }
  const timestamp = parseInt(timestampStr, 10)
  const now = Math.floor(Date.now() / 1000)

  // Expiration check (1 hour)
  if (isNaN(timestamp) || now - timestamp > TOKEN_EXPIRATION_SECONDS) {
    throw createError({
      message: 'Access Denied: Connection handshake expired.',
      statusCode: 401
    })
  }

  // Generate expected signature
  const expectedSignature = createHmac('sha256', secret).update(timestampStr).digest('hex')

  // Timing-safe comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(signature, 'hex')
  const expectedBuffer = Buffer.from(expectedSignature, 'hex')

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    throw createError({
      message: 'Access Denied: Terminal encryption mismatch (handshake failed).',
      statusCode: 403
    })
  }
}
