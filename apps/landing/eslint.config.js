import astro from '@t-minus/eslint-config/astro'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...astro,
  {
    ignores: ['dist/', '.astro/', '.vercel/', 'node_modules/']
  }
]
