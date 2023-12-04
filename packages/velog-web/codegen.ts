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
    'src/graphql/generated.ts': {
      documents: 'string',
      config: {
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        experimentalFragmentVariables: true,
        skipTypename: true,
        maybeValue: 'T | null',
        inputMaybeValue: 'T | undefined',
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
          JSON: 'JSON',
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
