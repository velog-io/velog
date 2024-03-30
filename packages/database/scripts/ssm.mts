import { SSMScript } from '@packages/common-scripts'

const parameterStoreService = new SSMScript({ packageName: 'database' })
parameterStoreService.excute()
