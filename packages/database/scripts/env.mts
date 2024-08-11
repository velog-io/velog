import path from 'path'
import { z } from 'zod'
import { existsSync } from 'fs'
import dotenv from 'dotenv'

// Only used for migration and deployment
if (!process.env.DOCKER_ENV && process.env.NODE_ENV !== undefined) {
  console.error(
    'Development environment was initiated, despite the absence of the Docker environment.',
  )
}

const configPath = path.resolve(process.cwd(), '.env')

if (!existsSync(configPath)) {
  console.log(`Read target: ${configPath}`)
  throw new Error('Not found environment file')
}

dotenv.config({ path: configPath })

const env = z.object({
  velogRdsUrl: z.string(),
  velogBookMongoUrl: z.string(),
  velogRedisHost: z.string(),
  velogRedisPort: z.number(),
})

export const ENV = env.parse({
  velogRdsUrl: process.env.VELOG_RDS_URL,
  velogBookMongoUrl: process.env.VELOG_BOOK_MONGO_URL,
  velogRedisHost: process.env.VELOG_REDIS_HOST,
  velogRedisPort: Number(process.env.VELOG_REDIS_PORT),
})
