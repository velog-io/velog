import { z } from 'zod'
import dotenv from 'dotenv'
import path from 'path'

if (process.env.NODE_ENV === 'production') {
  throw new Error('This Script only allowed in Development environment')
}

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const env = z.object({
  spamAccountDisplayName: z.array(z.string()).min(1),
  databaseUrl: z.string(),
  discordBotToken: z.string(),
  discordPrivatePostsChannelId: z.string(),
  redisHost: z.string(),
  restorePostsUsername: z.string().optional(),
})

export const ENV = env.parse({
  spamAccountDisplayName: (process.env.SPAM_ACCOUNT_DISPLAY_NAME ?? '')?.split(','),
  databaseUrl: process.env.DATABASE_URL,
  discordBotToken: process.env.DISCORD_BOT_TOKEN,
  discordPrivatePostsChannelId: process.env.DISCORD_PRIVATE_POSTS_CHANNEL_ID,
  redisHost: process.env.REDIS_HOST,
  restorePostsUsername: process.env.RESTORE_POSTS_USERNAME,
})
