import dotenv from 'dotenv'
import { container } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { existsSync } from 'fs'
import { z } from 'zod'

type DockerEnvrionment = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'
export type EnvFiles = Record<DockerEnvrionment, string>

const envFiles: EnvFiles = {
  development: '.env.development',
  production: '.env.production',
  stage: '.env.stage',
}

const dockerEnv = (process.env.DOCKER_ENV as DockerEnvrionment) || 'development'
const appEnv = (process.env.APP_ENV as AppEnvironment) || 'development'
const envFile = envFiles[appEnv]
const utils = container.resolve(UtilsService)
const prefix = appEnv === 'development' ? './env' : '../env'

const configPath = utils.resolveDir(`${prefix}/${envFile}`)

if (!existsSync(configPath)) {
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

export type EnvVars = z.infer<typeof env>

export const ENV = env.parse({
  dockerEnv,
  appEnv,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  cronApiKey: process.env.CRON_API_KEY,
  redisHost: process.env.REDIS_HOST,
})
