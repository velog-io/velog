import { Linter } from 'eslint'
import { resolve } from 'node:path'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const nextConfig = (projectPath: string) => {
  const tsconfigPath = resolve(projectPath, 'tsconfig.json')

  const compat = new FlatCompat({
    baseDirectory: projectPath,
    resolvePluginsRelativeTo: projectPath,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  })

  return [
    {
      ignores: ['node_modules', '.next', '.out'],
    },
    ...compat.config({
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsconfigPath,
        sourceType: 'module',
        tsconfigRootDir: projectPath,
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:react-hooks/recommended', // not yey support eslint 9
      ],
      root: true,
      globals: {
        React: true,
        JSX: true,
      },
      env: {
        node: true,
        browser: true,
      },
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@next/next/no-html-link-for-pages': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      },
    }),
  ] satisfies Linter.Config[]
}

export default nextConfig
