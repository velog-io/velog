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
type StackType = 'development' | 'stage' | 'production' | 'test'

class ParameterService {
  constructor(stack: StackType) {
    this.stack = stack
  }

  private stack: StackType
  private client = new SSMClient({ region: 'ap-northeast-2' })
  private __filename = fileURLToPath(import.meta.url)
  private __dirname = path.dirname(this.__filename)

  private get name() {
    return `/velog-v3/server/${this.stack}`
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
    const envPath = path.resolve(this.__dirname, `../../env/.env.${this.stack}`)
    if (!fs.existsSync(envPath)) {
      console.log(`Not found .env.${this.stack} file`)
      process.exit(1)
    }
    return fs.readFileSync(envPath, 'utf8')
  }
  private writeEnv(env: string) {
    const envPath = path.resolve(this.__dirname, `../../env/.env.${this.stack}`)
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
  const sFlagIndex = args.indexOf('-s')

  const flag = { type: '', stack: '' }
  if (tFlagIndex !== -1) {
    const type = args[tFlagIndex + 1]
    Object.assign(flag, { type })
  }
  if (sFlagIndex !== -1) {
    const stack = args[sFlagIndex + 1]
    Object.assign(flag, { stack })
  }

  return flag
}

type ChoicesKey = 'stack' | 'type'
type Choices = Record<ChoicesKey, string[]>

const validate = (choices: Choices, type: ChoicesKey, input: string): boolean => {
  return choices[type].includes(input)
}

const main = async () => {
  const flag = getFlag()

  let type = flag.type
  let stack = flag.stack

  const choices: Choices = {
    type: ['upload', 'download'],
    stack: ['development', 'stage', 'production', 'test'],
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

  if (!stack) {
    const { promptStack } = await inquirer.prompt([
      {
        type: 'list',
        name: 'promptStack',
        message: 'Please choose a stack: [Use arrows to move, type to filter]',
        choices: choices.stack,
        default: 'production',
      },
    ])
    stack = promptStack
  }

  if (!validate(choices, 'type', type)) {
    console.error(`${type} is not allowed operation type`)
    process.exit(1)
  }

  if (!validate(choices, 'stack', stack)) {
    console.error(`${stack} is not allowed stack`)
    process.exit(1)
  }

  console.info('Selected Options:')
  console.info(`-t: ${type}`)
  console.info(`-s: ${stack}`)

  const parameterService = new ParameterService(stack as StackType)
  const mapper = {
    upload: () => parameterService.uploadParameter(),
    download: () => parameterService.downloadParameter(),
  }
  await mapper[type as OperationType]()
}

main()
