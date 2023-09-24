import { ENV } from '../env'

const serverEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 1 : 1,
  cpu: 512,
  memory: 1024,
  maxCapacity: 3,
  minCapacity: ENV.isProduction ? 1 : 1,
}

const webEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 1 : 1,
  cpu: 1024,
  memory: 512,
  maxCapacity: 3,
  minCapacity: ENV.isProduction ? 1 : 1,
}

const cronEcsOption: EcsOption = {
  desiredCount: 1,
  cpu: 512,
  memory: 512,
  maxCapacity: 1,
  minCapacity: 1,
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
