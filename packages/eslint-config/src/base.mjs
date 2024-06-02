// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Linter } from 'eslint'
import { resolve } from 'path'
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
    ignores: ['node_modules'],
  },
  ...compat.config({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended'],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  }),
]
