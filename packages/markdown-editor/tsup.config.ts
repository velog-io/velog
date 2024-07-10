import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'markdown-editor',
  entry: ['src/index.tsx'],
  format: 'esm',
  dts: true,
  external: ['shiki', 'webpack'],
  outExtension: () => ({ js: '.js' }),
})
