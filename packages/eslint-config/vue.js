import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import base from './base.js'

/** @type {import('eslint').Linter.Config[]} */
const vueConfig = [
  ...base.filter(c => !c.plugins?.['prettier']), // Base JS/TS configs without Prettier
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
    },
  },
  ...base.filter(c => c.plugins?.['prettier']), // Prettier rules last
]

export default vueConfig
