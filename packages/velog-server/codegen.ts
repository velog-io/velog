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
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        skipTypename: true,
        contextType: './../common/interfaces/graphql#GraphQLContext',
        mappers: {
          User: '@prisma/client#User as UserModel',
          UserProfile: '@prisma/client#UserProfile as UserProfileModel',
          Post: '@prisma/client#Post as PostModel',
        },
        inputMaybeValue: 'T | undefined',
        scalars: {
          Date: 'Date',
          JSON: 'JSON',
          ID: 'string | undefined',
        },
      },
    },
  },
}

export default config
