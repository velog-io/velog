import { z } from 'zod'

// allowed standard env names,  https://nextjs.org/docs/messages/non-standard-node-env
const environment = z.enum(['development', 'test', 'production'])
type Envrionment = z.infer<typeof environment>

const appEnv = (process.env.NODE_ENV as Envrionment) || 'development'

const env = z.object({
  appEnv: environment,
  publicUrl: z.string(),
  clientHost: z.string(),
  clientV2Host: z.string(),
  apiV2Host: z.string(),
  apiV3Host: z.string(),
  graphqlHost: z.string(),
  graphqlHostNoCDN: z.string(),
  defaultPostLimit: z.number().default(24),
  gaMeasurementId: z.string(),
})

export const ENV = env.parse({
  appEnv,
  publicUrl: process.env.NEXT_PUBLIC_PUBLIC_URL,
  clientHost: process.env.NEXT_PUBLIC_CLIENT_HOST,
  clientV2Host: process.env.NEXT_PUBLIC_CLIENT_V2_HOST,
  apiV2Host: process.env.NEXT_PUBLIC_API_V2_HOST,
  apiV3Host: process.env.NEXT_PUBLIC_API_V3_HOST,
  graphqlHost: process.env.NEXT_PUBLIC_GRAPHQL_HOST,
  graphqlHostNoCDN: process.env.NEXT_PUBLIC_GRAPHQL_HOST_NOCDN,
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
})
