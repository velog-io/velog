import { SSMScript } from '@packages/scripts'

const ssmScript = new SSMScript({ packageName: 'server' })
ssmScript.execute()
