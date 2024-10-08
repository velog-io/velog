import baseConfig from '@packages/eslint-config/base.mjs'
import { resolve } from 'node:path'

const projectPath = resolve(process.cwd())

/** @type {Linter.Config} */
export default [
  ...baseConfig(projectPath),
  {
    ignores: ['node_modules', 'dist'],
  },
]
