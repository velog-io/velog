import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/**/*.gql',
  documents: undefined,
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    'src/graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        {
          add: {
            content: '/* eslint-disable @typescript-eslint/ban-types */',
          },
        },
      ],
      config: {
        skipTypename: true,
        contextType: './../common/interfaces/graphql#GraphQLContext',
        mappers: {
          User: '@prisma/client#User as UserModel',
          UserProfile: '@prisma/client#UserProfile as UserProfileModel',
          Post: '@prisma/client#Post as PostModel',
          Comment: '@prisma/client#Comment as CommentModel',
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
