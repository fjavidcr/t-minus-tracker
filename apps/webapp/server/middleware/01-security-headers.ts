import { defineEventHandler, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  // Only apply to HTML responses or all responses?
  // OWASP recommends these for all responses, but CSP and HSTS are most critical for HTML.

  const headers: Record<string, string> = {
    'Expect-CT': 'max-age=86400, enforce',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  }

  // Content Security Policy (CSP)
  // In a real app, we'd use a nonce. For now, we'll set a base policy.
  // We allow the SpaceDevs API and image domains.
  const cspBase = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Nuxt needs unsafe-inline/eval in dev, better to use nonces in prod
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://ll.thespacedevs.com",
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ')

  headers['Content-Security-Policy'] = cspBase

  setResponseHeaders(event, headers)
})
