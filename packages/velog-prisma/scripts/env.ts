import { fileURLToPath } from 'url'
import path from 'path'
import inquirer from 'inquirer'
import fs from 'fs'

const environments = ['development', 'stage', 'production', 'test']

type Environment = 'development' | 'stage' | 'production' | 'test'

async function main() {
  try {
    const filename = await getEnvName()
    createEnv(filename)
  } catch (error) {
    throw error
  }
}

main()

async function getEnvName() {
  const args = process.argv.slice(2)
  const eFlagIndex = args.indexOf('-e')

  let env: string | null = null
  if (eFlagIndex !== -1) {
    env = args[eFlagIndex + 1]
  }

  if (!env) {
    const { promptEnv } = await inquirer.prompt([
      {
        type: 'list',
        name: 'promptEnv',
        message: 'Please choose a environment: [Use arrows to move, type to filter]',
        choices: environments,
        default: 'development',
      },
    ])
    env = promptEnv
  }

  if (!environments.includes(env ?? '')) {
    console.error(`${env} is not allowed environment`)
    process.exit(1)
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
