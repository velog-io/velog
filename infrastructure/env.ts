import * as dotenv from 'dotenv'
import * as pulumi from '@pulumi/pulumi'
import { z } from 'zod'

const config = new pulumi.Config()
const appEnv = config.require('APP_ENV') as Envrionment

if (['development', 'stage', 'production'].includes(appEnv)) {
  throw new Error('Not allowed environment')
}

import { resolve } from 'path'

type Envrionment = 'development' | 'production' | 'stage'

function resolveDir(dir: string) {
  const resolvedDir = resolve(__dirname, dir)
  return resolvedDir
}

const envFiles: Record<Envrionment, string> = {
  development: '.env.development',
  production: '.env.production',
  stage: '.env.stage',
}

const file = envFiles[appEnv]

dotenv.config({ path: resolveDir(`./env/${file}`) })

type EnvType = {
  appEnv: Envrionment
  ecrRepositoryName: string
  port: number
}

const env = z.object({
  appEnv: z.string(),
  port: z.number(),
  ecrRepositoryName: z.string(),
})

export const ENV = env.parse({
  appEnv,
  port: Number(process.env.PORT),
  ecrRepositoryName: process.env.ECR_REPOSITORY_NAME,
})
