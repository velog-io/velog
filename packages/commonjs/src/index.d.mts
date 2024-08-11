import type { Axios } from 'axios'

declare module '@packages/commonjs' {
  const axios: Axios
  const loadSchemaSync: any
  const mergeResolvers: any
  const GraphQLFileLoader: any

  export { axios, loadSchemaSync, mergeResolvers, GraphQLFileLoader }
}
