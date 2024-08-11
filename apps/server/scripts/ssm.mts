import { SSMScript } from '@packages/scripts'

const ssm = new SSMScript({ packageName: 'server' })
ssm.excute()
