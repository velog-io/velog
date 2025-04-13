import { SSMScript } from '@packages/scripts'

const ssm = new SSMScript({ packageName: 'web' })
ssm.execute()
