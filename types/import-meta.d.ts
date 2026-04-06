/**
 * Global Type Augmentation for ImportMeta
 * Ensures standard Nuxt/Nitro properties are recognized across the project.
 */

export {}

declare global {
  interface ImportMeta {
    /** 
     * Whether we are running on the server.
     * @replacement for process.server (deprecated)
     */
    server: boolean;
    
    /** 
     * Whether we are running on the client (browser).
     * @replacement for process.client (deprecated)
     */
    client: boolean;
    
    /** 
     * Whether we are running in development mode.
     */
    dev: boolean;

    /**
     * Whether we are running in browser context.
     */
    browser: boolean;

    /**
     * Whether we are running in a test environment.
     */
    test: boolean;
    
    /**
     * Whether the application is being prerendered.
     */
    prerender: boolean;
  }
}
