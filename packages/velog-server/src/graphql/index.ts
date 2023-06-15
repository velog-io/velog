import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { mergeResolvers } from '@graphql-tools/merge'
import { JSONResolver, DateResolver } from 'graphql-scalars'
import { resolve } from 'path'

export const schema = loadSchemaSync(
  resolve(__dirname, './../../src/graphql/*.gql'),
  {
    loaders: [new GraphQLFileLoader()],
  }
)

export const resolvers = mergeResolvers([
  {
    JSON: JSONResolver,
    Date: DateResolver,
  },
])
