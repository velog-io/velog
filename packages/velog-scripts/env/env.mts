import { z } from 'zod'
import dotenv from 'dotenv'
import path from 'path'

if (process.env.NODE_ENV === 'production') {
  throw new Error('This Script only allowed in Development environment')
}

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const env = z.object({
  spamAccountDisplayName: z.array(z.string()),
  redisHost: z.string(),
  databaseUrl: z.string(),
})

export const ENV = env.parse({
  spamAccountDisplayName: (process.env.SPAM_ACCOUNT_DISPLAY_NAME ?? '')?.split(','),
  redisHost: process.env.REDIS_HOST,
  databaseUrl: process.env.DATABASE_URL,
})
