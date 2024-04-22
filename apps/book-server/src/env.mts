import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'

type DockerEnv = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'
type EnvFiles = Record<DockerEnv, string>

function resolveDir(dir: string): string {
  const __filename = fileURLToPath(import.meta.url)
  const splited = dirname(__filename).split('/src')
  const cwd = splited.slice(0, -1).join('/src')
  return join(cwd, dir)
}

const envFiles: EnvFiles = {
  development: '.env.development',
  production: '.env.production',
  stage: '.env.stage',
}

if (!process.env.DOCKER_ENV && process.env.NODE_ENV !== undefined) {
  console.error(
    'Development environment was initiated, despite the absence of the Docker environment.',
  )
}

const dockerEnv = (process.env.DOCKER_ENV as DockerEnv) || 'development'
const appEnv: AppEnvironment = ['stage', 'production'].includes(dockerEnv)
  ? 'production'
  : 'development'

const envFile = envFiles[dockerEnv]
const prefix = './env'

const configPath = resolveDir(`${prefix}/${envFile}`)

if (!existsSync(configPath)) {
  console.log(`Read target: ${configPath}`)
  throw new Error('Not found environment file')
}

dotenv.config({ path: configPath })

const env = z.object({
  dockerEnv: z.enum(['development', 'production', 'stage']),
  appEnv: z.enum(['development', 'production']),
  port: z.number(),
  mongoUrl: z.string(),
  discordBotToken: z.string(),
  discordErrorChannel: z.string(),
  redisHost: z.string(),
  redisPort: z.number(),
  bookBucketName: z.string(),
  bookBucketUrl: z.string(),
  cookieSecretKey: z.string(),
  jwtSecretKey: z.string(),
})

export const ENV = env.parse({
  dockerEnv,
  appEnv,
  port: Number(process.env.PORT),
  mongoUrl: process.env.MONGO_URL,
  discordBotToken: process.env.DISCORD_BOT_TOKEN,
  discordErrorChannel: process.env.DISCORD_ERROR_CHANNEL,
  redisHost: process.env.REDIS_HOST,
  redisPort: Number(process.env.REDIS_PORT),
  bookBucketName: process.env.BOOK_BUCKET_NAME,
  bookBucketUrl: process.env.BOOK_BUCKET_URL,
  cookieSecretKey: process.env.COOKIE_SECRET_KEY,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
})
