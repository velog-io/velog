import { SSMScript } from '@packages/common-scripts'

const ssm = new SSMScript({ packageName: 'server' })
ssm.excute()
