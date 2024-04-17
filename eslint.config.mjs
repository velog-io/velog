import baseConfig from '@packages/eslint-config/base.mjs'

/** @type {Linter.Config} */
export default [
  ...baseConfig,
  {
    ignores: [
      'node_modules',
      './packages/*',
      './apps/*',
      './infrastructure/*',
      '.lintstagedrc.mjs',
      '**/node_modules',
    ],
  },
]