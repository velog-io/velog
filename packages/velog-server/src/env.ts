import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { z } from 'zod'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { container } from 'tsyringe'

type DockerEnv = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'
type EnvFiles = Record<DockerEnv, string>

const envFiles: EnvFiles = {
  development: '.env.development',
  production: '.env.production',
  stage: '.env.stage',
}

if (!process.env.DOCKER_ENV) {
  console.error(
    'Development environment was initiated despite the absence of the Docker environment.',
  )
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
  clientV2Host: z.string(),
  clientV3Host: z.string(),
  apiHost: z.string(),
  cronHost: z.string(),
  cookieSecretKey: z.string(),
  jwtSecretKey: z.string(),
  databaseUrl: z.string(),
  esHost: z.string(),
  unscoredCategory: z.string(),
  unscoredWords: z.string(),
  cronApiKey: z.string(),
  githubClientId: z.string(),
  githubSecret: z.string(),
  facebookClientId: z.string(),
  facebookSecret: z.string(),
  googleClientId: z.string(),
  googleSecret: z.string(),
  b2KeyId: z.string(),
  b2Key: z.string(),
  b2BucketId: z.string(),
  codenaryWebhook: z.string(),
  codenaryApiKey: z.string(),
  codenaryCallback: z.string(),
  redisHost: z.string(),
})

export const ENV = env.parse({
  dockerEnv,
  appEnv,
  port: Number(process.env.PORT),
  clientV2Host: process.env.CLIENT_V2_HOST,
  clientV3Host: process.env.CLIENT_V3_HOST,
  apiHost: process.env.API_HOST,
  cronHost: process.env.CRON_HOST,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  cookieSecretKey: process.env.COOKIE_SECRET_KEY,
  databaseUrl: process.env.DATABASE_URL,
  esHost: process.env.ES_HOST,
  unscoredCategory: process.env.UNSCORED_CATEGORY,
  unscoredWords: process.env.UNSCORED_WORDS,
  cronApiKey: process.env.CRON_API_KEY,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookSecret: process.env.FACEBOOK_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_SECRET,
  b2KeyId: process.env.B2_KEY_ID,
  b2Key: process.env.B2_KEY,
  b2BucketId: process.env.B2_BUCKET_ID,
  codenaryWebhook: process.env.CODENARY_WEBHOOK,
  codenaryApiKey: process.env.CODENARY_API_KEY,
  codenaryCallback: process.env.CODENARY_CALLBACK,
  redisHost: process.env.REDIS_HOST,
})
