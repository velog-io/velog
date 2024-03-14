import { ENV } from '../env'

const webEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: ENV.isProduction ? 1024 : 512,
  memory: ENV.isProduction ? 2048 : 1024,
  memoryReservation: 512,
  maxCapacity: 12,
  minCapacity: ENV.isProduction ? 2 : 1,
}

const serverEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: ENV.isProduction ? 1024 * 0.75 : 512,
  memory: 1024,
  memoryReservation: 512,
  maxCapacity: 12,
  minCapacity: ENV.isProduction ? 2 : 1,
}

const cronEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 1 : 0,
  cpu: ENV.isProduction ? 1024 : 512,
  memory: 512,
  memoryReservation: 512,
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
  cpu: number
  memory: number
  memoryReservation: number
  maxCapacity: number
  minCapacity: number
}
