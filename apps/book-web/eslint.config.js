import nextConfig from '@packages/eslint-config/base.mjs'

/** @type {import("eslint").Linter.Config} */
export default [
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  ...nextConfig,
]
