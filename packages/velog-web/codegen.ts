import { ENV } from './src/env'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: `${ENV.graphqlHost}/graphql`,
  documents: 'src/graphql/*.gql',
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    'src/graphql/helpers/generated.ts': {
      documents: 'string',
      config: {
        reactQueryVersion: 5,
        addSuspenseQuery: true,
        exposeQueryKeys: true,
        exposeFetcher: true,
        exposeMutationKeys: true,
        skipTypename: true,
        inputMaybeValue: 'T | null | undefined',
        maybeValue: 'T | null',
        fetcher: {
          func: './fetcher#fetcher',
        },
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
    },
  },
}

export default config
