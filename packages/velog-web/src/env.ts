import dotenv from 'dotenv'
import { z } from 'zod'
import { resolve } from 'path'

const environment = z.enum(['development', 'test', 'stage', 'production'])
type Envrionment = z.infer<typeof environment>

const envFiles: Record<Envrionment, string> = {
  development: '.env.development',
  test: '.env.test',
  stage: '.env.stage',
  production: '.env.production',
}

function resolveDir(dir: string) {
  const resolvedDir = resolve(__dirname, dir)
  return resolvedDir
}
const appEnv = (process.env.NODE_ENV as Envrionment) || 'development'
const envFile = envFiles[appEnv]

dotenv.config({ path: resolveDir(`../env/${envFile}`) })

const env = z.object({
  appEnv: environment,
  publicUrl: z.string(),
  clientHost: z.string(),
  clientV2Host: z.string(),
  clientV3Host: z.string(),
  apiV2Host: z.string(),
  apiV3Host: z.string(),
  graphqlHost: z.string(),
  graphqlHostNoCDN: z.string(),
  defaultPostTimeFrame: z.string(),
  defaultPostLimit: z.number(),
  gaMeasurementId: z.string(),
})

export const ENV = env.parse({
  appEnv,
  publicUrl: process.env.PUBLIC_URL,
  clientHost: process.env.CLIENT_HOST,
  clientV2Host: process.env.NEXT_PUBLIC_CLIENT_V2_HOST,
  clientV3Host: process.env.NEXT_PUBLIC_CLIENT_V3_HOST,
  apiV2Host: process.env.NEXT_PUBLIC_API_V2_HOST,
  apiV3Host: process.env.NEXT_PUBLIC_API_V3_HOST,
  graphqlHost: process.env.NEXT_PUBLIC_GRAPHQL_HOST,
  graphqlHostNoCDN: process.env.NEXT_PUBLIC_GRAPHQL_HOST_NOCDN,
  defaultPostTimeFrame: process.env.NEXT_PUBLIC_DEFAULT_POST_TIMEFRAME,
  defaultPostLimit: Number(process.env.NEXT_PUBLIC_DEFAULT_POST_LIMIT),
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
})
