import { SSMScript } from '@packages/scripts'

const ssmScript = new SSMScript({ packageName: 'database' })
ssmScript.execute()
