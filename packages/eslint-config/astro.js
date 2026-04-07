import astroPlugin from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'
import base from './base.js'

/** @type {import('eslint').Linter.Config[]} */
const astroConfig = [
  ...base.filter((c) => !c.plugins?.['prettier']), // Base JS/TS configs without Prettier
  ...astroPlugin.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
  ...base.filter((c) => c.plugins?.['prettier']), // Prettier rules last
]

export default astroConfig
