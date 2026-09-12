import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist/**', 'node_modules/**', '.opencode/**'] },
  js.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        __LAST_UPDATE__: 'readonly',
      },
    },
  },
]