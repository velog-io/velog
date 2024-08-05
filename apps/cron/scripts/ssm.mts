import { SSMScript } from '@packages/scripts'

const ssm = new SSMScript({ packageName: 'cron' })
ssm.excute()
