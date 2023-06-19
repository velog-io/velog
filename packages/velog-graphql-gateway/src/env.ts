import dotenv from 'dotenv'
import { Envrionment, EnvFiles, EnvVars } from './common/interfaces/env.js'
import { resolve } from 'path'

const envFiles: EnvFiles = {
  development: '.env.development',
  production: '.env.production',
  test: '.env.test',
}

const appEnv = (process.env.APP_ENV as Envrionment) || 'development'

const resolveDir = (dir: string): string => resolve(process.cwd(), dir)

const file = envFiles[appEnv]
dotenv.config({ path: resolveDir(`./env/${file}`) })

export const ENV = {
  appEnv,
  port: Number(process.env.PORT),
  velogV2Api: process.env.VELOG_V2_API,
  velogV3Api: process.env.VELOG_V3_API,
} as EnvVars
