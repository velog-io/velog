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
          User: '@packages/database/src/velog-rds.mjs#User as UserModel',
          UserProfile: '@packages/database/src/velog-rds.mjs#UserProfile as UserProfileModel',
          Post: '@packages/database/src/velog-rds.mjs#Post as PostModel',
          Comment: '@packages/database/src/velog-rds.mjs#Comment as CommentModel',
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
