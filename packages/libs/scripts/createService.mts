import { CreateServiceScript } from '@packages/scripts'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createServiceScript = new CreateServiceScript({ __dirname })
createServiceScript.excute()
