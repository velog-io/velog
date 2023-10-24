import dotenv from 'dotenv'
import { container } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { existsSync } from 'fs'
import { z } from 'zod'

type DockerEnv = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'
export type EnvFiles = Record<DockerEnv, string>

const envFiles: EnvFiles = {
  development: '.env.development',
  stage: '.env.stage',
  production: '.env.production',
}

const dockerEnv = (process.env.DOCKER_ENV as DockerEnv) || 'development'
const appEnv: AppEnvironment = ['stage', 'production'].includes(dockerEnv)
  ? 'production'
  : 'development'

const envFile = envFiles[dockerEnv]
const prefix = dockerEnv === 'development' ? './env' : '../env'

const utils = container.resolve(UtilsService)
const configPath = utils.resolveDir(`${prefix}/${envFile}`)

if (!existsSync(configPath)) {
  console.log(`Read target: ${configPath}`)
  throw new Error('Not found environment file')
}

dotenv.config({ path: configPath })

const env = z.object({
  dockerEnv: z.enum(['development', 'production', 'stage']),
  appEnv: z.enum(['development', 'production']),
  port: z.number(),
  databaseUrl: z.string(),
  cronApiKey: z.string(),
  redisHost: z.string(),
})

export const ENV = env.parse({
  dockerEnv,
  appEnv,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  cronApiKey: process.env.CRON_API_KEY,
  redisHost: process.env.REDIS_HOST,
})
