import { z } from 'zod'

type DockerEnv = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'

const dockerEnv = (process.env.DOCKER_ENV as DockerEnv) || 'development'
const appEnv: AppEnvironment = ['stage', 'production'].includes(dockerEnv)
  ? 'production'
  : 'development'

const env = z.object({
  appEnv: z.string(),
  graphqlBookServerHost: z.string(),
})

export const ENV = env.parse({
  appEnv,
  graphqlBookServerHost: process.env.NEXT_PUBLIC_GRAPHQL_BOOK_SERVER_HOST,
})
