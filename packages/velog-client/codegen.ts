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
      config: {
        fetcher: {
          endpoint: `${process.env.NEXT_PUBLIC_GRAPHQL_HOST}/graphql`,
          fetchParams: {
            headers: {
              'content-type': 'application/json',
            },
          },
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
