import { GraphQLFileLoader, loadSchemaSync, mergeResolvers } from '@packages/commonjs'
import { readdirSync } from 'fs'
import { VoidResolver, PositiveIntResolver } from 'graphql-scalars'
import { IResolvers, MercuriusContext } from 'mercurius'
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { ENV } from '@env'

async function resolverAutoLoader(): Promise<any[]> {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const resolverFolderPath = resolve(__dirname, 'resolvers')

  const promises = readdirSync(resolverFolderPath).map(async (resolverPath) => {
    const suffix = ENV.appEnv === 'development' ? '.mts' : '.mjs'
    const resolvername = basename(resolverPath, suffix)
    const resolver = await import(`./resolvers/${resolvername}.mjs`)
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
      // Date: DateTimeISOResolver,
      Void: VoidResolver,
      PositiveInt: PositiveIntResolver,
    },
  ]),
) as IResolvers<any, MercuriusContext>
