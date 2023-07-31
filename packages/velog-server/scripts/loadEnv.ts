import {
  SSMClient,
  GetParametersByPathCommand,
  GetParametersByPathCommandInput,
} from '@aws-sdk/client-ssm'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import inquirer from 'inquirer'

const uppperSnakeCase = (input: string) =>
  input
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/[-\s]/g, '_')
    .toUpperCase()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const readEnv = (): string => {
  const envPath = path.resolve(__dirname, '../env/.env.production')
  if (!fs.existsSync(envPath)) return ''
  return fs.readFileSync(envPath, 'utf8')
}

const writeEnv = (env: string): void => {
  const envPath = path.resolve(__dirname, '../env/.env.production')
  fs.writeFileSync(envPath, env, { encoding: 'utf-8' })
}

const main = async () => {
  const { stack } = await inquirer.prompt([
    {
      type: 'list',
      name: 'stack',
      message: 'Please choose a stack: [Use arrows to move, type to filter]',
      choices: ['development', 'stage', 'production'],
      default: 'development',
    },
  ])

  const pathPrefix = `/velog-v3/${stack}/`
  const client = new SSMClient({ region: 'ap-northeast-2' })

  const input: GetParametersByPathCommandInput = {
    Path: pathPrefix,
    WithDecryption: true,
  }

  const command = new GetParametersByPathCommand(input)
  const response = await client.send(command)

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error('Failed to get parameters from SSM')
  }

  const fromSSM = response
    .Parameters!.filter(({ Name }) => !!Name)
    .map(({ Name, Value }) => ({
      name: uppperSnakeCase(Name!.replace(pathPrefix, '')),
      value: Value,
    }))
    .map(({ name, value }) => `${name}=${value}`)
    .join('\n')

  const text = 'from SSM'
  const comment = `\n# ------------ ${text} ------------\n`

  const commentLineIndex = readEnv()
    .split('\n')
    .findIndex((v) => v.includes(text))

  const line = readEnv().split('\n')

  const splitLine = commentLineIndex > -1 ? commentLineIndex - 1 : line.length

  const env = line.slice(0, splitLine).concat(comment).concat(fromSSM).join('\n')
  writeEnv(env)
}

main()
