import { ENV } from '../env'

const webEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  containerCpu: ENV.isProduction ? 1024 : 512,
  containerMemory: ENV.isProduction ? 2048 : 1024,
  maxCapacity: 12,
  minCapacity: ENV.isProduction ? 2 : 1,
}

const serverEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  containerCpu: ENV.isProduction ? 1024 : 512,
  containerMemory: 1024,
  maxCapacity: 12,
  minCapacity: ENV.isProduction ? 2 : 1,
}

const cronEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 1 : 0,
  containerCpu: ENV.isProduction ? 1024 : 512,
  containerMemory: 512,
  maxCapacity: 1,
  minCapacity: ENV.isProduction ? 1 : 0,
}

export const ecsOption = {
  web: webEcsOption,
  server: serverEcsOption,
  cron: cronEcsOption,
}

type EcsOption = {
  desiredCount: number
  containerCpu: number
  containerMemory: number
  maxCapacity: number
  minCapacity: number
}
