import vue from '@t-minus/eslint-config/vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...vue,
  {
    ignores: ['dist/', 'node_modules/']
  }
]
