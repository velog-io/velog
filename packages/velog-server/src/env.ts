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
  test: '.env.test',
  stage: '.env.stage',
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
  appEnv: z.enum(['development', 'test', 'stage', 'production']),
  port: z.number(),
  clientHost: z.string(),
  apiHost: z.string(),
  cookieSecretKey: z.string(),
  jwtSecretKey: z.string(),
  databaseUrl: z.string(),
  githubId: z.string(),
  githubSecret: z.string(),
  facebookId: z.string(),
  facebookSecret: z.string(),
  googleId: z.string(),
  googleSecret: z.string(),
})

export const ENV = env.parse({
  appEnv,
  port: Number(process.env.PORT),
  clientHost: process.env.CLIENT_HOST,
  apiHost: process.env.API_HOST,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  cookieSecretKey: process.env.COOKIE_SECRET_KEY,
  databaseUrl: process.env.DATABASE_URL,
  githubId: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
  facebookId: process.env.FACEBOOK_CLIENT_ID,
  facebookSecret: process.env.FACEBOOK_SECRET,
  googleId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_SECRET,
})
