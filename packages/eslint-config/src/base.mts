import { resolve } from 'node:path'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import type { Linter } from 'eslint'

const baseConfig = (projectPath: string) => {
  const tsconfigPath = resolve(projectPath, 'tsconfig.json')

  const compat = new FlatCompat({
    baseDirectory: projectPath,
    resolvePluginsRelativeTo: projectPath,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  })

  return [
    {
      ignores: ['node_modules'],
    },
    ...compat.config({
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsconfigPath,
        sourceType: 'module',
        tsconfigRootDir: projectPath,
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      root: true,
      env: {
        node: true,
        jest: true,
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'off',
          {
            ignoreRestSiblings: true,
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
      },
    }),
  ] satisfies Linter.Config[]
}

export default baseConfig
