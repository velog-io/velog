import nextConfig from '@packages/eslint-config/next.mjs'

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
]
