import { ENV } from './env'
import * as aws from '@pulumi/aws'
import { createECSfargateService, getLatestImage } from './src/server/ecs'

export = async () => {
  const repository = await aws.ecr.getRepository({
    name: ENV.ecrServerRepositoryName,
  })

  const ecrImageName = getLatestImage(repository)
  createECSfargateService(ecrImageName)
}
