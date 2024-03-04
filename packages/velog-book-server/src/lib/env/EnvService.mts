import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { injectable, singleton } from 'tsyringe'
import { fileURLToPath } from 'url'
import { z } from 'zod'

interface Service {}

@injectable()
@singleton()
export class EnvService implements Service {
  private env: any
  public init() {
    const envFiles: EnvFiles = {
      development: '.env.development',
      production: '.env.production',
      stage: '.env.stage',
    }

    if (!process.env.DOCKER_ENV && process.env.NODE_ENV !== undefined) {
      console.error(
        'Development environment was initiated, despite the absence of the Docker environment.',
      )
    }

    const dockerEnv = (process.env.DOCKER_ENV as DockerEnv) || 'development'
    const appEnv: AppEnvironment = ['stage', 'production'].includes(dockerEnv)
      ? 'production'
      : 'development'

    const envFile = envFiles[dockerEnv]
    const prefix = dockerEnv === 'development' ? './env' : '../env'

    const configPath = this.resolveDir(`${prefix}/${envFile}`)

    if (!existsSync(configPath)) {
      console.log(`Read target: ${configPath}`)
      throw new Error('Not found environment file')
    }

    dotenv.config({ path: configPath })

    const env = z.object({
      dockerEnv: z.enum(['development', 'production', 'stage']),
      appEnv: z.enum(['development', 'production']),
      port: z.number(),
    })

    const ENV: ENV = env.parse({
      dockerEnv,
      appEnv,
      port: Number(process.env.PORT),
    })

    this.env = ENV
  }

  private resolveDir(dir: string): string {
    const __filename = fileURLToPath(import.meta.url)
    const splited = dirname(__filename).split('/src')
    const cwd = splited.slice(0, -1).join('/src')
    return join(cwd, dir)
  }

  public get(key: keyof ENV) {
    return this.env[key]
  }
}

type DockerEnv = 'development' | 'stage' | 'production'
type AppEnvironment = 'development' | 'production'
type EnvFiles = Record<DockerEnv, string>
type ENV = {
  dockerEnv: string
  appEnv: string
  port: number
}
