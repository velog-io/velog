import { SSMScript } from '@packages/scripts'

const ssmScript = new SSMScript({ packageName: 'not-shared' })
ssmScript.excute()
