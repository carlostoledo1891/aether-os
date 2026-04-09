import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'server/dist', 'engine/dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-restricted-syntax': ['warn',
        {
          selector: 'CallExpression[callee.name="useServiceQuery"][arguments.length>2]',
          message: 'useServiceQuery takes (key, selector). For dynamic arguments, use useServiceQueryWithArg(key, arg, selector).',
        },
      ],
    },
  },
  /* Map modules export layer IDs + mappers alongside components; provider exports hooks */
  {
    files: [
      'src/components/map/**/*.tsx',
      'src/services/DataServiceProvider.tsx',
    ],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
