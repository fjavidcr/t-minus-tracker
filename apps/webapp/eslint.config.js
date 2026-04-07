import nuxt from '@t-minus/eslint-config/nuxt'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nuxt,
  {
    ignores: ['dist/', '.nuxt/', '.output/', '.vercel/', 'node_modules/']
  }
]
