import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/utils/**/*.{js,ts}',
    './app/App.{js,ts,vue}',
    './app/app.vue',
    './app/Error.{js,ts,vue}',
    './app/error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Orbitar Material Design tokens
        "inverse-surface": "#dfe2ee",
        "on-primary-container": "#8dadff",
        "outline": "#8e909d",
        "on-secondary-fixed": "#341100",
        "surface-container": "#1c2028",
        "surface": "#0f131c",
        "surface-variant": "#31353e",
        "on-tertiary": "#163440",
        "surface-dim": "#0f131c",
        "primary": "#0B3D91", // NASA Blue
        "secondary-fixed-dim": "#ffb692",
        "on-primary-fixed-variant": "#144296",
        "error-container": "#93000a",
        "on-secondary-fixed-variant": "#7a3000",
        "surface-container-lowest": "#0a0e16",
        "on-secondary-container": "#ffffff",
        "secondary-fixed": "#ffdbcb",
        "inverse-on-surface": "#2c3039",
        "on-primary": "#ffffff",
        "secondary": "#Fc3d21", // Artemis Orange
        "surface-container-low": "#181c24",
        "inverse-primary": "#345baf",
        "surface-bright": "#353942",
        "on-tertiary-fixed": "#001f2a",
        "error": "#ffb4ab",
        "on-primary-fixed": "#ffffff",
        "primary-container": "#0B3D91",
        "on-secondary": "#ffffff",
        "on-error-container": "#ffdad6",
        "tertiary": "#adcbda",
        "primary-fixed": "#dae2ff",
        "secondary-container": "#Fc3d21",
        "primary-fixed-dim": "#b1c5ff",
        "on-tertiary-fixed-variant": "#2e4b57",
        "tertiary-fixed-dim": "#adcbda",
        "on-tertiary-container": "#96b3c2",
        "background": "#0f131c",
        "tertiary-container": "#294653",
        "on-surface-variant": "#c4c6d3",
        "surface-container-high": "#262a33",
        "surface-container-highest": "#31353e",
        "on-background": "#dfe2ee",
        "outline-variant": "#434652",
        "tertiary-fixed": "#c9e7f7",
        "on-surface": "#dfe2ee",
        "on-error": "#690005",
        "surface-tint": "#0B3D91",
        // shadcn/ui CSS variable tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Geist Sans', 'sans-serif'],
        label: ['Lexend', 'sans-serif'],
        sans: ['Geist Sans', 'sans-serif']
      },

      borderRadius: {
        DEFAULT: '0.5rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.5rem',
        full: '9999px'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ]
}
