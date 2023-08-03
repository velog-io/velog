import path from 'path'
import fs from 'fs'
import { GetParameterCommand, GetParameterCommandInput, SSMClient } from '@aws-sdk/client-ssm'

const parameterPrefix = (env: string) => `/velog-v3/infrastructure/${env}`

const ParameterPull = async () => {
  const env = process.env.NODE_ENV
  const args = process.argv.slice(2)
  const sFlagIndex = args.indexOf('-e')
  const environment = args[sFlagIndex + 1] || env || 'development'

  if (!['development', 'production', 'stage'].includes(environment)) {
    throw new Error('Not allow environment')
  }

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

ParameterPull()
