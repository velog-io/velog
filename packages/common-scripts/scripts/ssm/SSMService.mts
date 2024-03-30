import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import {
  GetParameterCommand,
  GetParameterCommandInput,
  PutParameterCommand,
  PutParameterCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm'

type OperationType = 'push' | 'pull'
type Environment = 'development' | 'stage' | 'production' | 'test'

type Option = {
  packageName: string
}

export class SSMService {
  constructor({ packageName }: Option) {
    this.packageName = packageName
    const { environment, version } = this.getFlag()
    this.environment = environment
    this.version = version
  }

  private environment: Environment
  private version: number
  private packageName: string
  private client = new SSMClient({ region: 'ap-northeast-2' })
  private __filename = fileURLToPath(import.meta.url)
  private __dirname = path.dirname(this.__filename)
  private get name() {
    let name = `/velog-v3/${this.packageName}/${this.environment}`
    if (this.version > 0) {
      name = `${name}:${this.version}`
    }
    return name
  }
  private get envPath() {
    const envPath = path.resolve(this.__dirname, `../../env/.env.${this.environment}`)
    return envPath
  }
  private readEnv = (): string => {
    const envPath = this.envPath
    if (!fs.existsSync(envPath)) {
      console.log(`Not found .env.${this.environment} file`)
      process.exit(1)
    }
    return fs.readFileSync(envPath, 'utf8')
  }
  private writeEnv(env: string): void {
    fs.writeFileSync(this.envPath, env, { encoding: 'utf-8' })
  }

  public async excute() {
    if (!this.packageName) {
      console.error('packageName is required')
      process.exit(1)
    }

    let command = process.argv[2]
    let environment = this.environment
    const version = this.version

    const choices: Choices = {
      command: ['push', 'pull'],
      environment: ['development', 'stage', 'production', 'test'],
    }

    if (!command) {
      const { promptCommand } = await inquirer.prompt([
        {
          type: 'list',
          name: 'promptCommand',
          message: 'Please choose the operation type: [Use arrows to move, type to filter]',
          choices: choices.command,
          default: 'production',
        },
      ])
      command = promptCommand
    }

    if (!environment) {
      const { promptEnvironment } = await inquirer.prompt([
        {
          type: 'list',
          name: 'promptEnvironment',
          message: 'Please choose a environment: [Use arrows to move, type to filter]',
          choices: choices.environment,
          default: 'production',
        },
      ])
      environment = promptEnvironment
    }

    if (!choices.command.includes(command)) {
      console.error(`${command} is not allowed operation type`)
      process.exit(1)
    }

    if (!choices.environment.includes(environment)) {
      console.error(`${environment} is not allowed environment`)
      process.exit(1)
    }

    console.info('Selected Options:')
    console.info(`command: ${command}`)
    console.info(`environment: ${environment}`)
    if (version > 0) {
      console.info(`version: ${version}`)
    }

    const mapper = {
      push: () => this.push(),
      pull: () => this.pull(),
    }
    await mapper[command as OperationType]()
  }
  private async pull() {
    try {
      const name = this.name
      const input: GetParameterCommandInput = {
        Name: name,
        WithDecryption: true,
      }

      const command = new GetParameterCommand(input)
      const response = await this.client.send(command)

      const value = response.Parameter?.Value
      if (!value) {
        console.error('The path parameter exists, but retrieving the value failed')
        process.exit(1)
      }

      const env = JSON.parse(value)
      this.writeEnv(env)
      console.info(
        `Parameter download successful! path: ${name}, version: ${response.Parameter?.Version}`,
      )
    } catch (error) {
      console.log(error)
    }
  }
  private async push() {
    try {
      const text = this.readEnv()
      const name = this.name
      const input: PutParameterCommandInput = {
        Name: name,
        Value: JSON.stringify(text),
        Overwrite: true,
        Type: 'SecureString',
      }
      const command = new PutParameterCommand(input)
      const response = await this.client.send(command)
      console.info(`Parameter upload successful! path: ${name}, version: ${response.Version}`)
    } catch (_) {}
  }
  private getFlag() {
    const args = process.argv.slice(3)

    const eFlagIndex = args.indexOf('-e')
    const vFlagIndex = args.indexOf('-v')

    const flag = { environment: '', version: 0 }
    if (eFlagIndex !== -1) {
      const environment = args[eFlagIndex + 1]
      Object.assign(flag, { environment })
    }

    if (vFlagIndex !== -1) {
      const version = args[vFlagIndex + 1]
      if (!Number(version)) {
        throw new Error('Invalid version format. The version must be a numeric value')
      }
      Object.assign(flag, { version: Number(version) })
    }
    return flag as { environment: Environment; version: number }
  }
}

type ChoicesKey = 'command' | 'environment'
type Choices = Record<ChoicesKey, string[]>
