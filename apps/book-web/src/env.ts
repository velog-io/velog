import { z } from 'zod'

type DockerEnv = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'

const dockerEnv = (process.env.DOCKER_ENV as DockerEnv) || 'development'
const appEnv: AppEnvironment = ['stage', 'production'].includes(dockerEnv)
  ? 'production'
  : 'development'

const env = z.object({
  dockerEnv: z.enum(['development', 'production', 'stage']),
  appEnv: z.enum(['development', 'production']),
  publicUrl: z.string(),
  clientHost: z.string(),
  graphqlServerHost: z.string(),
  graphqlBookServerHost: z.string(),
})

export const ENV = env.parse({
  dockerEnv,
  // allowed standard env names,  https://nextjs.org/docs/messages/non-standard-node-env
  appEnv,
  publicUrl: process.env.NEXT_PUBLIC_PUBLIC_URL,
  clientHost: process.env.NEXT_PUBLIC_CLIENT_HOST,
  graphqlServerHost: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_HOST,
  graphqlBookServerHost: process.env.NEXT_PUBLIC_GRAPHQL_BOOK_SERVER_HOST,
})
