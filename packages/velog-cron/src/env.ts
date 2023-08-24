import dotenv from 'dotenv'
import { container } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { existsSync } from 'fs'
import { z } from 'zod'

export type Envrionment = 'development' | 'test' | 'stage' | 'production'
export type EnvFiles = Record<Envrionment, string>

const envFiles: EnvFiles = {
  development: '.env.development',
  production: '.env.production',
  stage: '.env.stage',
  test: '.env.test',
}

const appEnv = (process.env.NODE_ENV as Envrionment) || 'development'
const envFile = envFiles[appEnv]
const utils = container.resolve(UtilsService)
const prefix = appEnv === 'production' ? '../env' : './env'

const configPath = utils.resolveDir(`${prefix}/${envFile}`)

if (!existsSync(configPath)) {
  throw new Error('Not found environment file')
}

dotenv.config({ path: configPath })

const env = z.object({
  appEnv: z.enum(['development', 'production', 'stage', 'test']),
  port: z.number(),
  databaseUrl: z.string(),
  cronApiKey: z.string(),
})

export type EnvVars = z.infer<typeof env>

export const ENV = env.parse({
  appEnv,
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  cronApiKey: process.env.CRON_API_KEY,
})
