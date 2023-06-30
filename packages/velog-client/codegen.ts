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
        skipTypename: true,
        avoidOptionals: true,
        maybeValue: 'T',
      },
      plugins: [
        'typescript',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript-graphql-request',
        {
          add: {
            content: `
            export const graphQLClient = new GraphQLClient(
              '${process.env.NEXT_PUBLIC_GRAPHQL_HOST}/graphql',
              {
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
            `,
          },
        },
      ],
    },
  },
}

export default config
