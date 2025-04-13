import path from 'path'
import inquirer from 'inquirer'
import fs from 'fs'

const choices = ['development', 'stage', 'production', 'test', 'cancel']

type Environment = 'development' | 'stage' | 'production' | 'test'

export class CopyEnvScript {
  private envFolderPath: string
  constructor(envFolderPath = './env') {
    this.envFolderPath = envFolderPath
  }
  public async execute() {
    try {
      const envName = this.getEnvironment() || (await this.getEnvName())

      if (!choices.includes(envName ?? '')) {
        throw new Error(`${envName} is not allowed environment`)
      }

      this.createEnv(envName as Environment)
    } catch (error: any) {
      console.log(error.message)
      process.exit(130) // The value is the same as the Prisma migration error code.
    }
  }
  private getEnvironment = () => {
    const args = process.argv.slice(2)
    const eFlagIndex = args.indexOf('-e')

    const flag = { environment: '' }
    if (eFlagIndex !== -1) {
      const environment = args[eFlagIndex + 1]
      Object.assign(flag, { environment })
    }
    return flag.environment
  }
  private getEnvPath(filename: Environment) {
    const envPath = path.resolve(process.cwd(), `${this.envFolderPath}/.env.${filename}`)
    if (!fs.existsSync(envPath)) {
      throw new Error(`Not found .env.${filename} file`)
    }
    return envPath
  }
  private createEnv(filename: Environment) {
    try {
      const source = this.getEnvPath(filename)
      const target = path.resolve(process.cwd(), '.env')
      fs.copyFileSync(source, target)
    } catch (error) {
      throw error
    }
  }
  private async getEnvName() {
    const isOnlyDev = process.argv.find((arg) => arg === '--only-dev')

    const { promptEnv } = await inquirer.prompt([
      {
        type: 'list',
        name: 'promptEnv',
        message: 'Please choose a environment: [Use arrows to move, type to filter]',
        choices: isOnlyDev
          ? choices.filter((env) => ['development', 'cancel'].includes(env))
          : choices,
        default: 'development',
      },
    ])
    const env = promptEnv

    if (env === 'cancel') {
      throw new Error('Canceled by user.')
    }

    if (!choices.includes(env ?? '')) {
      throw new Error(`${env} is not allowed environment`)
    }
    return env as Environment
  }
}
