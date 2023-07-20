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
  appEnv: z.string(),
  port: z.number(),
  clientHost: z.string(),
  cookieSecretKey: z.string(),
  jwtSecretKey: z.string(),
  awsDefaultProfile: z.string(),
  esHost: z.string(),
  social: z.object({
    githubId: z.string(),
    githubSecret: z.string(),
    facebookId: z.string(),
    facebookSecret: z.string(),
    googleId: z.string(),
    googleSecret: z.string(),
  }),
  hashKey: z.string(),
  slack: z.object({
    token: z.string(),
    image: z.string(),
  }),
  googleApplicationCredentials: z.string(),
  banned: z.object({
    keywords: z.string(),
    altKeywords: z.string(),
  }),
  unscored: z.object({
    category: z.string(),
    words: z.string(),
  }),
  graphcdnToken: z.string(),
  blacklist: z.object({
    username: z.string(),
    ip: z.string(),
  }),
  cloudflare: z.object({
    id: z.string(),
    token: z.string(),
    accountHash: z.string(),
  }),
  b2: z.object({
    keyId: z.string(),
    key: z.string(),
    bucketId: z.string(),
  }),
  codenary: z.object({
    apiKey: z.string(),
    webhook: z.string(),
    callback: z.string(),
  }),
  databaseUrl: z.string(),
})

export const ENV = env.parse({
  appEnv,
  port: Number(process.env.PORT),
  clientHost: process.env.CLIENT_HOST,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  cookieSecretKey: process.env.COOKIE_SECRET_KEY,
  awsDefaultProfile: process.env.AWS_DEFAULT_PROFILE,
  esHost: process.env.ES_HOST,
  social: {
    githubId: process.env.GITHUB_ID,
    githubSecret: process.env.GITHUB_SECRET,
    facebookId: process.env.FACEBOOK_ID,
    facebookSecret: process.env.FACEBOOK_SECRET,
    googleId: process.env.GOOGLE_ID,
    googleSecret: process.env.GOOGLE_SECRET,
  },
  hashKey: process.env.HASH_KEY,
  slack: {
    token: process.env.SLACK_TOKEN,
    image: process.env.SLACK_IMAGE,
  },
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  banned: {
    keywords: process.env.BANNED_KEYWORDS,
    altKeywords: process.env.BANNED_ALT_KEYWORDS,
  },
  unscored: {
    category: process.env.UNSCORED_CATEGORY,
    words: process.env.UNSCORED_WORDS,
  },
  graphcdnToken: process.env.GRAPHCDN_TOKEN,
  blacklist: {
    username: process.env.BLACKLIST_USERNAME,
    ip: process.env.BLACKLIST_IP,
  },
  cloudflare: {
    id: process.env.CLOUDFLARE_ID,
    token: process.env.CLOUDFLARE_TOKEN,
    accountHash: process.env.CLOUDFLARE_ACCOUNT_HASH,
  },
  b2: {
    keyId: process.env.B2_KEY_ID,
    key: process.env.B2_KEY,
    bucketId: process.env.B2_BUCKET_ID,
  },
  codenary: {
    apiKey: process.env.CODENARY_API_KEY,
    webhook: process.env.CODENARY_WEBHOOK,
    callback: process.env.CODENARY_CALLBACK,
  },
  databaseUrl: process.env.DATABASE_URL,
})

export type EnvVars = z.infer<typeof env>
