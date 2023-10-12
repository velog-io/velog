import { ENV } from '../env'

const serverEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: 512,
  memory: 1024,
  maxCapacity: 12,
  minCapacity: ENV.isProduction ? 2 : 1,
}

const webEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: ENV.isProduction ? 1024 : 512,
  memory: ENV.isProduction ? 2048 : 1024,
  maxCapacity: 12,
  minCapacity: ENV.isProduction ? 2 : 1,
}

const cronEcsOption: EcsOption = {
  desiredCount: 1,
  cpu: 512,
  memory: 1024,
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
