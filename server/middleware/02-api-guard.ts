import { defineEventHandler, getRequestPath } from 'h3';
import { validateApiRequest } from '../utils/security';

export default defineEventHandler((event) => {
  const path = getRequestPath(event);
  
  // Protect all /api/ paths except for any that should be public
  if (path.startsWith('/api/')) {
    // Check if it's an internal API call from our own client
    try {
      validateApiRequest(event);
    } catch (error: any) {
      // If validation fails, it throws a 401 or 403 error which H3 handles
      throw error;
    }
  }
});
