import path from 'path'
import fs from 'fs'
import { PutParameterCommand, PutParameterCommandInput, SSMClient } from '@aws-sdk/client-ssm'

const parameterPrefix = (env: string) => `/velog-v3/infrastructure/${env}`

const ParameterPush = async () => {
  const env = process.env.NODE_ENV
  const args = process.argv.slice(2)
  const sFlagIndex = args.indexOf('-e')
  const environment = args[sFlagIndex + 1] || env || 'development'

  if (!['development', 'production', 'stage'].includes(environment)) {
    throw new Error('Not allow environment')
  }

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

ParameterPush()
