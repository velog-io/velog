import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { mergeResolvers } from '@graphql-tools/merge'
import { Resolvers } from '@graphql/generated'
import { readdirSync } from 'fs'
import { JSONResolver, DateTimeISOResolver } from 'graphql-scalars'
import { IResolvers, MercuriusContext } from 'mercurius'
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

async function resolverLoader(): Promise<Resolvers[]> {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const resolverFolderPath = resolve(__dirname, 'resolvers')

  const promises = readdirSync(resolverFolderPath).map(async (resolverPath) => {
    const resolvername = basename(resolverPath, '.ts')
    const resolver = await import(`./resolvers/${resolvername}.js`)
    return resolver.default
  })
  return await Promise.all(promises)
}

export const schema = loadSchemaSync(resolve(process.cwd(), 'src/graphql/*.gql'), {
  loaders: [new GraphQLFileLoader()],
})

const loadedResolver = await resolverLoader()

export const resolvers = mergeResolvers(
  loadedResolver.concat([
    {
      JSON: JSONResolver,
      Date: DateTimeISOResolver,
    },
  ])
) as IResolvers<any, MercuriusContext>
