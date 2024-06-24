import baseConfig from '@packages/eslint-config/base.mjs'
import { resolve } from 'node:path'

const project = resolve(process.cwd())

/** @type {Linter.Config} */
export default [
  ...baseConfig(project),
  {
    ignores: [
      'node_modules',
      './apps/*',
      './infrastructure/*',
      '.lintstagedrc.mjs',
      '**/node_modules',
    ],
  },
]
