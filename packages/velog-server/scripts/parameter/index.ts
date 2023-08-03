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

type OperationType = 'upload' | 'download'
type Environment = 'development' | 'stage' | 'production' | 'test'

class ParameterService {
  constructor(environment: Environment) {
    this.environment = environment
  }

  private environment: Environment
  private client = new SSMClient({ region: 'ap-northeast-2' })
  private __filename = fileURLToPath(import.meta.url)
  private __dirname = path.dirname(this.__filename)

  private get name() {
    return `/velog-v3/server/${this.environment}`
  }

  public async uploadParameter() {
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
  private readEnv = (): string => {
    const envPath = path.resolve(this.__dirname, `../../env/.env.${this.environment}`)
    if (!fs.existsSync(envPath)) {
      console.log(`Not found .env.${this.environment} file`)
      process.exit(1)
    }
    return fs.readFileSync(envPath, 'utf8')
  }
  private writeEnv(env: string) {
    const envPath = path.resolve(this.__dirname, `../../env/.env.${this.environment}`)
    fs.writeFileSync(envPath, env, { encoding: 'utf-8' })
  }
  public async downloadParameter() {
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
        `Parameter download successful! path: ${name}, version: ${response.Parameter?.Version}`
      )
    } catch (error) {
      console.log(error)
    }
  }
}

const getFlag = () => {
  const args = process.argv.slice(2)

  const tFlagIndex = args.indexOf('-t')
  const sFlagIndex = args.indexOf('-e')

  const flag = { type: '', environment: '' }
  if (tFlagIndex !== -1) {
    const type = args[tFlagIndex + 1]
    Object.assign(flag, { type })
  }
  if (sFlagIndex !== -1) {
    const environment = args[sFlagIndex + 1]
    Object.assign(flag, { environment })
  }

  return flag
}

type ChoicesKey = 'environment' | 'type'
type Choices = Record<ChoicesKey, string[]>

const validate = (choices: Choices, type: ChoicesKey, input: string): boolean => {
  return choices[type].includes(input)
}

const main = async () => {
  const flag = getFlag()

  let type = flag.type
  let environment = flag.environment

  const choices: Choices = {
    type: ['upload', 'download'],
    environment: ['development', 'stage', 'production', 'test'],
  }

  if (!type) {
    const { promptType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'promptType',
        message: 'Please choose the operation type: [Use arrows to move, type to filter]',
        choices: choices.type,
        default: 'production',
      },
    ])
    type = promptType
  }

  if (!environment) {
    const { promptEnvironment } = await inquirer.prompt([
      {
        type: 'list',
        name: 'promptEnvironment',
        message: 'Please choose a stack: [Use arrows to move, type to filter]',
        choices: choices.environment,
        default: 'production',
      },
    ])
    environment = promptEnvironment
  }

  if (!validate(choices, 'type', type)) {
    console.error(`${type} is not allowed operation type`)
    process.exit(1)
  }

  if (!validate(choices, 'environment', environment)) {
    console.error(`${environment} is not allowed environment`)
    process.exit(1)
  }

  console.info('Selected Options:')
  console.info(`-t: ${type}`)
  console.info(`-e: ${environment}`)

  const parameterService = new ParameterService(environment as Environment)
  const mapper = {
    upload: () => parameterService.uploadParameter(),
    download: () => parameterService.downloadParameter(),
  }
  await mapper[type as OperationType]()
}

main()
