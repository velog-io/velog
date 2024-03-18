import { ENV } from '../env'

// fargate cpu memory combination
// See: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html
// 0.25 vCPU : 0.5 GB ~ 2 GB
// 0.5 vCPU : 1 GB ~ 4 GB
// 1 vCPU : 2 GB ~ 8 GB
// 2 vCPU : 4 GB ~ 16 GB
// 4 vCPU : 8 GB ~ 30 GB

const webProdEcsOption: EcsBaseOption = {
  desiredCount: 2,
  cpu: 1, // unit 1024
  memory: 2, // unit 1024
  maxCapacity: 12,
  minCapacity: 2,
}

const webStageEcsOption: EcsBaseOption = {
  desiredCount: 1,
  cpu: 0.5, // unit 1024
  memory: 1, // unit 1024
  maxCapacity: 12,
  minCapacity: 1,
}

const serverProdEcsOption: EcsBaseOption = {
  desiredCount: 2,
  cpu: 1, // unit 1024
  memory: 2, // unit 1024
  maxCapacity: 12,
  minCapacity: 2,
}

const serverStageEcsOption: EcsBaseOption = {
  desiredCount: 1,
  cpu: 0.25, // unit 1024
  memory: 1, // unit 1024
  maxCapacity: 12,
  minCapacity: 1,
}

const cronProdEcsOption: EcsBaseOption = {
  desiredCount: 1,
  cpu: 0.5, // unit 1024
  memory: 1, // unit 1024
  maxCapacity: 1,
  minCapacity: 1,
}

const cronStageEcsOption: EcsBaseOption = {
  desiredCount: 0,
  cpu: 0.25, // unit 1024
  memory: 0.5, // unit 1024
  maxCapacity: 0,
  minCapacity: 0,
}

export const ecsOption = {
  web: generateEcsOption(ENV.isProduction ? webProdEcsOption : webStageEcsOption),
  server: generateEcsOption(ENV.isProduction ? serverProdEcsOption : serverStageEcsOption),
  cron: generateEcsOption(ENV.isProduction ? cronProdEcsOption : cronStageEcsOption),
}

function generateEcsOption(option: EcsBaseOption): EcsOption {
  return {
    desiredCount: option.desiredCount,
    taskCpu: `${option.cpu} vCPU`,
    taskMemory: `${option.memory} GB`,
    containerCpu: 1024 * option.cpu,
    containerMemory: 1024 * option.memory,
    maxCapacity: option.maxCapacity,
    minCapacity: option.minCapacity,
  }
}

type EcsBaseOption = {
  desiredCount: number
  cpu: number
  memory: number
  maxCapacity: number
  minCapacity: number
}

type EcsOption = {
  desiredCount: number
  taskCpu: string
  taskMemory: string
  containerCpu: number
  containerMemory: number
  maxCapacity: number
  minCapacity: number
}
