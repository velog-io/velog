import { container } from 'tsyringe'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { mergeResolvers } from '@graphql-tools/merge'

import { readdirSync } from 'fs'
import { DateTimeISOResolver, VoidResolver, PositiveIntResolver } from 'graphql-scalars'
import { IResolvers, MercuriusContext } from 'mercurius'
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { EnvService } from '@lib/env/EnvService.mjs'

async function resolverAutoLoader(): Promise<any[]> {
  const env = container.resolve(EnvService)

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const resolverFolderPath = resolve(__dirname, 'resolvers')

  const promises = readdirSync(resolverFolderPath).map(async (resolverPath) => {
    const suffix = env.get('appEnv') === 'development' ? '.mts' : '.mjs'
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
      Date: DateTimeISOResolver,
      Void: VoidResolver,
      PositiveInt: PositiveIntResolver,
    },
  ]),
) as IResolvers<any, MercuriusContext>
