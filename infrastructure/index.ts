import { ENV } from './env'
import * as aws from '@pulumi/aws'
import { createECSfargateService, getLatestImage } from './src/server/ecs'

export = async () => {
  const repository = await aws.ecr.getRepository({
    name: ENV.ecrServerRepositoryName,
  })

  console.log(repository)
  console.log('process', process.env)
  console.log('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID)
  // const ecrImageName = getLatestImage(repository)
  // createECSfargateService(ecrImageName)
}
