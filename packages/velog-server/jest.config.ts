// eslint-disable-next-line @typescript-eslint/no-var-requires
const { compilerOptions } = require('./tsconfig.json')
import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  clearMocks: true,
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: ['.*\\.test\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta', // or, alternatively, 'ts-jest-mock-import-meta' directly, without node_modules.
              options: { metaObjectReplacement: { url: `file://${__dirname}` } },
            },
          ],
        },
      },
    ],
  },
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['node_modules', 'dist'],
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.ts'],
  rootDir: './',
  modulePaths: ['./'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    useESM: true,
  }),
}

export default config
