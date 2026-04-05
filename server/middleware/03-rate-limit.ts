import { defineEventHandler, createError, getRequestIP } from 'h3';

/**
 * Lightweight In-Memory Rate Limiter
 * Current Config: 100 requests / 15 minutes per IP
 */

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 Minutes
const MAX_LIMIT = 100;
const rateLimitStore = new Map<string, RateLimitInfo>();

// Prune expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

export default defineEventHandler((event) => {
  // Only apply to internal API routes
  if (!event.path.startsWith('/api/')) return;

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  const now = Date.now();
  
  let info = rateLimitStore.get(ip);

  if (!info || now > info.resetTime) {
    info = {
      count: 0,
      resetTime: now + WINDOW_MS
    };
  }

  info.count++;
  rateLimitStore.set(ip, info);

  // Set standard rate limit headers
  event.node.res.setHeader('X-RateLimit-Limit', MAX_LIMIT);
  event.node.res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_LIMIT - info.count));
  event.node.res.setHeader('X-RateLimit-Reset', Math.ceil(info.resetTime / 1000));

  if (info.count > MAX_LIMIT) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'Equatorial sector busy. Orbital requests throttled for 15 minutes.'
    });
  }
});
