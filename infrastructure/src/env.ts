import * as dotenv from 'dotenv'
import * as pulumi from '@pulumi/pulumi'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { z } from 'zod'

const config = new pulumi.Config()

const dockerEnv = config.require('DOCKER_ENV') as DockerEnv

if (!['development', 'stage', 'production'].includes(dockerEnv)) {
  throw new Error('Not allowed environment')
}

const envFiles: Record<DockerEnv, string> = {
  development: '.env.development',
  stage: '.env.stage',
  production: '.env.production',
}

const file = envFiles[dockerEnv]

function resolveDir(dir: string) {
  const resolvedDir = resolve(__dirname, dir)
  return resolvedDir
}

const configPath = resolveDir(`../env/${file}`)

if (!existsSync(configPath)) {
  console.log(`Read target: ${configPath}`)
  throw new Error('Not found environment file')
}

dotenv.config({ path: resolveDir(`../env/${file}`) })

const env = z.object({
  dockerEnv: z.string(),
  isProduction: z.boolean(),
  webV2Port: z.number(),
  webV3Port: z.number(),
  serverPort: z.number(),
  cronPort: z.number(),
  ecrWebRepositoryName: z.string(),
  ecrServerRepositoryName: z.string(),
  ecrCronRepositoryName: z.string(),
  certificateDomain: z.string(),
  awsAccessKeyId: z.string(),
  awsSecretAccessKey: z.string(),
})

export const ENV = env.parse({
  dockerEnv,
  isProduction: dockerEnv === 'production',
  webV2Port: Number(process.env.WEB_V2_PORT),
  webV3Port: Number(process.env.WEB_V3_PORT),
  serverPort: Number(process.env.SERVER_PORT),
  cronPort: Number(process.env.CRON_PORT),
  ecrWebRepositoryName: process.env.ECR_WEB_REPOSITORY_NAME,
  ecrServerRepositoryName: process.env.ECR_SERVER_REPOSITORY_NAME,
  ecrCronRepositoryName: process.env.ECR_CRON_REPOSITORY_NAME,
  certificateDomain: process.env.CERTIFICATE_DOMAIN,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

type DockerEnv = 'development' | 'production' | 'stage'
