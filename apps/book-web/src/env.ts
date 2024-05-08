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
  apiV3Host: z.string(),
  bookApiHost: z.string(),
})

export const ENV = env.parse({
  dockerEnv,
  // allowed standard env names,  https://nextjs.org/docs/messages/non-standard-node-env
  appEnv,
  publicUrl: process.env.NEXT_PUBLIC_PUBLIC_URL,
  clientHost: process.env.NEXT_PUBLIC_CLIENT_HOST,
  apiV3Host: process.env.NEXT_PUBLIC_API_V3_HOST,
  bookApiHost: process.env.NEXT_PUBLIC_BOOK_API_HOST,
})
