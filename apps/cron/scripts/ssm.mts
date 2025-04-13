import { SSMScript } from '@packages/scripts'

const ssmScript = new SSMScript({ packageName: 'cron' })
ssmScript.execute()
