import { fileURLToPath } from 'url'
import path from 'path'
import inquirer from 'inquirer'
import fs from 'fs'

const choices = ['development', 'stage', 'production', 'test', 'cancel']

type Environment = 'development' | 'stage' | 'production' | 'test'

async function main() {
  try {
    const filename = await getEnvName()
    createEnv(filename)
  } catch (error: any) {
    console.log(error.message)
    process.exit(130) // The value is the same as the Prisma migration error code.
  }
}

main()

async function getEnvName() {
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

function createEnv(filename: Environment) {
  try {
    const source = getEnvPath(filename)
    const target = path.resolve(process.cwd(), '.env')
    fs.copyFileSync(source, target)
  } catch (error) {
    throw error
  }
}

function getEnvPath(filename: Environment) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const envPath = path.resolve(__dirname, `../env/.env.${filename}`)
  if (!fs.existsSync(envPath)) {
    throw new Error(`Not found .env.${filename} file`)
  }
  return envPath
}
