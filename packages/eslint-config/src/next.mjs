import { resolve } from 'node:path'
import { FlatCompat } from '@eslint/eslintrc'

const project = resolve(process.cwd(), 'tsconfig.json')
const __dirname = new URL('.', import.meta.url).pathname

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
})

/** @type {Linter.Config} */
export default [
  {
    ignores: ['node_modules', '.next', '.out'],
  },
  ...compat.config({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    globals: {
      React: true,
      JSX: true,
    },
    env: {
      node: true,
      browser: true,
    },
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@next/next/no-html-link-for-pages': 'off',
    },
  }),
]
