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
  production: '.env.production',
  stage: '.env.stage',
}

const file = envFiles[appEnv]

dotenv.config({ path: resolveDir(`./env/${file}`) })

const env = z.object({
  appEnv: z.string(),
  isProduction: z.boolean(),
  serverPort: z.number(),
  ecrWebRepositoryName: z.string(),
  ecrServerRepositoryName: z.string(),
  sslCertificateArn: z.string(),
  awsAccessKeyId: z.string(),
  awsSecretAccessKey: z.string(),
})

export const ENV = env.parse({
  appEnv,
  isProduction: appEnv === 'production',
  webPort: Number(process.env.WEB_PORT),
  serverPort: Number(process.env.SERVER_PORT),
  ecrWebRepositoryName: process.env.ECR_WEB_REPOSITORY_NAME,
  ecrServerRepositoryName: process.env.ECR_SERVER_REPOSITORY_NAME,
  sslCertificateArn: process.env.SSL_CERTIFICATE_ARN,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})
