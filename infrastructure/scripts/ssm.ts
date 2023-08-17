import path from 'path'
import fs from 'fs'
import {
  GetParameterCommand,
  GetParameterCommandInput,
  PutParameterCommand,
  PutParameterCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm'

const parameterPrefix = (env: string) => `/velog-v3/infrastructure/${env}`

const pull = async (environment: string) => {
  const client = new SSMClient({ region: 'ap-northeast-2' })
  const name = parameterPrefix(environment)
  const input: GetParameterCommandInput = {
    Name: name,
    WithDecryption: true,
  }

  const command = new GetParameterCommand(input)
  const response = await client.send(command)

  const value = response.Parameter?.Value

  if (!value) {
    throw new Error('The path parameter exists, but retrieving the value failed')
  }

  const text = JSON.parse(value)
  const envPath = path.resolve(__dirname, `../env/.env.${environment}`)
  fs.writeFileSync(envPath, text, { encoding: 'utf-8' })
}

const push = async (environment: string) => {
  const envPath = path.resolve(__dirname, `../env/.env.${environment}`)

  if (!fs.existsSync(envPath)) {
    console.log(`given env path: ${envPath}`)
    throw new Error('Not found environment file')
  }

  const client = new SSMClient({ region: 'ap-northeast-2' })
  const text = fs.readFileSync(envPath, { encoding: 'utf-8' })
  const name = parameterPrefix(environment)
  const input: PutParameterCommandInput = {
    Name: name,
    Value: JSON.stringify(text),
    Overwrite: true,
    Type: 'SecureString',
  }
  const command = new PutParameterCommand(input)
  const response = await client.send(command)
  return response
}

const main = () => {
  const command = process.argv[2]

  if (!['push', 'pull'].includes(command)) {
    throw new Error(`${command} is Invalid command`)
  }

  const env = process.env.NODE_ENV
  const args = process.argv.slice(3)
  const eFlagIndex = args.indexOf('-e')
  const environment = args[eFlagIndex + 1] || env || ''

  if (!['development', 'production', 'stage'].includes(environment)) {
    throw new Error('Not allow environment')
  }

  const mapper = {
    push: (environment: string) => push(environment),
    pull: (environment: string) => pull(environment),
  }
  mapper[command as Command](environment)
  console.log(`SSM ${command} success!`)
}

main()

type Command = 'push' | 'pull'
