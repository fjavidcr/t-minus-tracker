import base from '@t-minus/eslint-config/base'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base,
  {
    ignores: ['dist/', '.astro/', '.nuxt/', '.output/', '.vercel/', 'node_modules/']
  }
]
