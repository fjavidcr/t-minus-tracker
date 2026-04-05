import { defineNuxtPlugin, useState, useRuntimeConfig } from '#app';
import { generateSecureToken } from '../../server/utils/security';

export default defineNuxtPlugin((nuxtApp) => {
  // Only run this on the server
  if (import.meta.server) {
    const config = useRuntimeConfig();
    const secret = (config.apiSecretKey as string) || '';
    
    // Generate a fresh token for this request/session
    const token = generateSecureToken(secret);
    
    // Store in shared Nuxt state ('useState') so it's serialized to the client
    const secureToken = useState('secureToken', () => token);
    secureToken.value = token;
  }
});
