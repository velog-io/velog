import * as dotenv from 'dotenv'
import * as pulumi from '@pulumi/pulumi'
import { z } from 'zod'

const config = new pulumi.Config()

const appEnv = config.require('APP_ENV') as Envrionment

if (!['development', 'stage', 'production'].includes(appEnv)) {
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
  stage: '.env.stage',
  production: '.env.production',
}

const file = envFiles[appEnv]

dotenv.config({ path: resolveDir(`./env/${file}`) })

const env = z.object({
  appEnv: z.string(),
  port: z.number(),
  ecrWebRepositoryName: z.string(),
  ecrServerRepositoryName: z.string(),
  sslCertificateArn: z.string(),
})

export const ENV = env.parse({
  appEnv,
  port: Number(process.env.PORT),
  ecrWebRepositoryName: process.env.ECR_WEB_REPOSITORY_NAME,
  ecrServerRepositoryName: process.env.ECR_SERVER_REPOSITORY_NAME,
  sslCertificateArn: process.env.SSL_CERTIFICATE_ARN,
})
