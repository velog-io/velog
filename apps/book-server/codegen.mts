import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/*.gql',
  documents: undefined,
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  emitLegacyCommonJSImports: false,
  generates: {
    'src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        {
          add: {
            content: `/* eslint-disable @typescript-eslint/ban-types */`,
          },
        },
      ],
      config: {
        enumsAsTypes: true,
        skipTypename: true,
        contextType: '../common/interfaces/graphql.mjs#GraphQLContext',
        mappers: {
          Book: '@packages/database/velog-book-mongo#Book as BookModel',
          Writer: '@packages/database/velog-book-mongo#Writer as WriterModel',
          Page: '@packages/database/velog-book-mongo#Page as PageModel',
        },
        inputMaybeValue: 'T | null',
        maybeValue: 'T | null',
        scalars: {
          Date: 'Date',
          JSON: 'Record<string, any>',
          ID: 'string',
          Void: 'void',
          PositiveInt: 'number',
        },
      },
    },
  },
}

export default config
