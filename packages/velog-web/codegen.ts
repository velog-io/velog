import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.NEXT_PUBLIC_GRAPHQL_HOST}/graphql`,
  documents: 'src/graphql/*.gql',
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    'src/graphql/generated.ts': {
      documents: 'string',
      config: {
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
