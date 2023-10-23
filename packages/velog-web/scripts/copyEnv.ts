import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

type Environment = 'development' | 'stage' | 'production'

const getEnvironment = () => {
  const args = process.argv.slice(2)
  const eFlagIndex = args.indexOf('-e')

  const flag = { environment: '' }
  if (eFlagIndex !== -1) {
    const environment = args[eFlagIndex + 1]
    Object.assign(flag, { environment })
  }
  return flag
}

const main = () => {
  const { environment } = getEnvironment()

  const whiteList = ['development', 'stage', 'production']
  if (!whiteList.includes(environment)) {
    console.log('Not allowed environment')
    process.exit(1)
  }

  try {
    const source = getEnvPath(environment as Environment)
    const target = path.resolve(process.cwd(), '.env')
    fs.copyFileSync(source, target)

    console.log(`Copied ${environment} environment!`)
  } catch (error) {
    throw error
  }
}

main()

function getEnvPath(filename: Environment) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const envPath = path.resolve(__dirname, `../env/.env.${filename}`)
  if (!fs.existsSync(envPath)) {
    throw new Error(`Not found .env.${filename} file`)
  }
  return envPath
}
