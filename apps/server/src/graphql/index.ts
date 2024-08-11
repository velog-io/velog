import { Resolvers } from '@graphql/helpers/generated.js'
import { readdirSync } from 'fs'
import { DateTimeISOResolver, VoidResolver, PositiveIntResolver } from 'graphql-scalars'
import { IResolvers, MercuriusContext } from 'mercurius'
import { basename, dirname, resolve } from 'path'
import { ENV } from '@env'
import { fileURLToPath } from 'url'
import { GraphQLFileLoader, loadSchemaSync, mergeResolvers } from '@packages/commonjs'

async function resolverAutoLoader(): Promise<Resolvers[]> {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const resolverFolderPath = resolve(__dirname, 'resolvers')

  const promises = readdirSync(resolverFolderPath).map(async (resolverPath) => {
    const suffix = ENV.appEnv === 'development' ? '.ts' : '.js'
    const resolvername = basename(resolverPath, suffix)
    const resolver = await import(`./resolvers/${resolvername}.js`)
    return resolver.default
  })
  return await Promise.all(promises)
}

export const schema = loadSchemaSync(resolve(process.cwd(), 'src/graphql/*.gql'), {
  loaders: [new GraphQLFileLoader()],
})

const loadedResolver = await resolverAutoLoader()

export const resolvers = mergeResolvers(
  loadedResolver.concat([
    {
      Date: DateTimeISOResolver,
      Void: VoidResolver,
      PositiveInt: PositiveIntResolver,
    },
  ]),
) as IResolvers<any, MercuriusContext>
