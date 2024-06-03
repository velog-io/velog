import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'nextra-editor',
  entry: ['src/index.tsx'],
  format: 'esm',
  target: 'es2020',
  dts: true,
  external: ['shiki', 'webpack'],
  outExtension: () => ({ js: '.js' }),
})
