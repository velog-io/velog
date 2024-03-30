import { SSMService } from '@packages/common-scripts'

const main = () => {
  const parameterStoreService = new SSMService({ packageName: 'database' })
  parameterStoreService.excute()
}

main()
