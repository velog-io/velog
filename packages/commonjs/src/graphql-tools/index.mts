import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const { loadSchemaSync } = require('@graphql-tools/load')
const { mergeResolvers } = require('@graphql-tools/merge')
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')

export { loadSchemaSync, mergeResolvers, GraphQLFileLoader }
