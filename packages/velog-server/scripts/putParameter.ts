import { SSMClient, PutParameterCommand, PutParameterCommandInput } from '@aws-sdk/client-ssm'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import inquirer from 'inquirer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const readEnvNames = () => {
  const envPath = path.resolve(__dirname, '../env/')
  return fs.readdirSync(envPath).filter((file) => file.startsWith('.env'))
}

const readEnv = (filename: string): string => {
  const envPath = path.resolve(__dirname, `../env/${filename}`)
  if (!fs.existsSync(envPath)) return ''
  return fs.readFileSync(envPath, 'utf8')
}

const main = async () => {
  const choices = readEnvNames()

  const { env }: { env: string } = await inquirer.prompt([
    {
      type: 'list',
      name: 'env',
      message: 'Please choose a target env file: [Use arrows to move, type to filter]',
      choices: choices,
      default: choices[0],
    },
  ])

  const text = readEnv(env)

  const stack = env.split('.')[2]

  const name = `/velog-v3/${stack}`
  console.info(`stack is ${stack}, parameter name is ${name}`)

  const client = new SSMClient({ region: 'ap-northeast-2' })

  const input: PutParameterCommandInput = {
    Name: name,
    Value: JSON.stringify(text),
    Overwrite: true,
  }

  // const command = new PutParameterCommand()
}

main()
