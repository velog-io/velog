import { ENV } from './src/env.js'
import type { CodegenConfig } from '@graphql-codegen/cli'
import type { Types } from '@graphql-codegen/plugin-helpers'

const commonGenerateOptions: Types.ConfiguredOutput = {
  config: {
    enumsAsTypes: true,
    reactQueryVersion: 5,
    addSuspenseQuery: true,
    exposeQueryKeys: true,
    exposeFetcher: true,
    exposeMutationKeys: true,
    skipTypename: true,
    inputMaybeValue: 'T | null | undefined',
    maybeValue: 'T | null',
    avoidOptionals: {
      field: true,
      inputValue: false,
      object: true,
      defaultValue: true,
    },
    scalars: {
      Date: 'Date',
      JSON: 'Record<string, any>',
      ID: 'string',
      Void: 'void',
      PositiveInt: 'number',
    },
  },
  plugins: [
    'typescript',
    '@graphql-codegen/typescript-operations',
    '@graphql-codegen/typescript-react-query',
  ],
}

const config: CodegenConfig = {
  overwrite: true,
  hooks: {
    afterOneFileWrite: ['prettier --write .'],
  },
  generates: {
    // 'src/graphql/server/generated/server.ts': {
    //   schema: `${ENV.apiV3Host}/graphql`,
    //   documents: './src/graphql/server/*.gql',
    //   config: {
    //     ...commonGenerateOptions.config,
    //     fetcher: {
    //       func: '../helpers/serverFetcher#fetcher',
    //     },
    //   },
    //   plugins: commonGenerateOptions.plugins,
    // },
    'src/graphql/bookServer/generated/bookServer.ts': {
      schema: `${ENV.graphqlBookServerHost}/graphql`,
      documents: './src/graphql/bookServer/*.gql',
      config: {
        ...commonGenerateOptions.config,
        fetcher: {
          func: '../helpers/bookServerFetcher#fetcher',
        },
      },
      plugins: commonGenerateOptions.plugins,
    },
  },
}

export default config
