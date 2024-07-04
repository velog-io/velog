import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'nextra-editor',
  entry: ['src/index.tsx'],
  format: 'esm',
  dts: true,
  external: ['shiki', 'webpack'],
  outExtension: () => ({ js: '.js' }),
})
