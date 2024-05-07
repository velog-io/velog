import nextConfig from '@packages/eslint-config/next.mjs'

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextConfig,
  {
    ignores: ['node_modules', 'dist', 'style.css'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
]
