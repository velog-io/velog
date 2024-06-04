import { z } from 'zod'

type DockerEnv = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'

const dockerEnv = (process.env.DOCKER_ENV as DockerEnv) || 'development'
const appEnv: AppEnvironment = ['stage', 'production'].includes(dockerEnv)
  ? 'production'
  : 'development'

const env = z.object({
  apiV3Host: z.string(),
})

export const ENV = env.parse({
  appEnv,
  apiV3Host: process.env.NEXT_PUBLIC_API_V3_HOST,
})
