import { CreateServiceScript } from '@packages/scripts'

// const __filename = new URL("", import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname

const createServiceScript = new CreateServiceScript({ __dirname, isPackages: true })
createServiceScript.excute()
