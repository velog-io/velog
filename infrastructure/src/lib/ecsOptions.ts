import { ENV } from '../env'

const serverEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: 512,
  memory: 1024,
  maxCapacity: 3,
  minCapacity: ENV.isProduction ? 3 : 1,
}

const webEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: 256,
  memory: 512,
  maxCapacity: 3,
  minCapacity: ENV.isProduction ? 3 : 1,
}

const cronEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: 256,
  memory: 512,
  maxCapacity: 3,
  minCapacity: ENV.isProduction ? 3 : 1,
}

export const ecsOption = {
  web: webEcsOption,
  server: serverEcsOption,
  cron: cronEcsOption,
}

type EcsOption = {
  desiredCount: number
  cpu: number
  memory: number
  maxCapacity: number
  minCapacity: number
}
