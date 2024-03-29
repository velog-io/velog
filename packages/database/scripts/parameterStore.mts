import { ParameterStoreService } from '@packages/common-scripts/index.mjs'

const main = () => {
  const parameterStoreService = new ParameterStoreService({ packageName: 'database' })
  parameterStoreService.excute()
}

main()
