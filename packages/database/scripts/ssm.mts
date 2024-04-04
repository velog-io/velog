import { SSMScript } from '@packages/scripts'

const parameterStoreService = new SSMScript({ packageName: 'database' })
parameterStoreService.excute()
