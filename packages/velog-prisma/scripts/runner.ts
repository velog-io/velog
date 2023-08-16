import { fileURLToPath } from 'url'
import path from 'path'
import inquirer from 'inquirer'
import { exec } from 'child_process'
import fs from 'fs'

async function main() {
  try {
    const env = await Env.getEnvironment()
    const runner = new Runner()
  } catch (error) {
    throw error
  }
}

const environments = ['development', 'stage', 'production', 'test']

class Env {
  static async getEnvironment(): Promise<Environment> {
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
          name: 'promptEnvironment',
          message: 'Please choose a environment: [Use arrows to move, type to filter]',
          choices: environments,
          default: 'production'
        }
      ])
      env = promptEnv
    }

    if (!environments.includes(env ?? '')) {
      console.error(`${env} is not allowed environment`)
      process.exit(1)
    }

    return env as Environment
  }
}

class Runner {
  static pathValidate(env: string) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const envPath = path.resolve(__dirname, `../env/.env.${env}`)
    if (!fs.existsSync(envPath)) {
      throw new Error(`Not found .env.${env} file`)
    }
    if (fs) return envPath
  }

  public execPromise(command: string) {
    return new Promise(function (resolve, reject) {
      exec(command, (error, stdout, _stderr) => {
        if (error) {
          reject(error)
          return
        }
        resolve(stdout)
      })
    })
  }
}

type Environment = 'development' | 'stage' | 'production' | 'test'
