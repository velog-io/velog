import { ParameterStoreService } from 'lib/parameterStore/PrameterStoreService.mjs'

const main = () => {
  const parameterStoreService = new ParameterStoreService({ packageName: 'scripts' })
  parameterStoreService.excute()
}

main()
