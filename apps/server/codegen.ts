import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/**/*.gql',
  documents: undefined,
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
  generates: {
    'src/graphql/helpers/generated.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        {
          add: {
            content: `/* eslint-disable @typescript-eslint/ban-types */
            /* eslint-disable @typescript-eslint/no-unused-vars */`,
          },
        },
      ],
      config: {
        skipTypename: true,
        contextType: './../../common/interfaces/graphql#GraphQLContext',
        enumValues: {
          NotificationType: './enums#NotificationType',
        },
        mappers: {
          User: '@prisma/velog-rds/client#User as UserModel',
          UserProfile: '@prisma/velog-rds/client#UserProfile as UserProfileModel',
          Post: '@prisma/velog-rds/client#Post as PostModel',
          Comment: '@prisma/velog-rds/client#Comment as CommentModel',
        },
        inputMaybeValue: 'T | undefined',
        maybeValue: 'T | null | undefined',
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
