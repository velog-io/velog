import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'

import { withPrefix } from '../../lib/prefix'
import { ecsTaskExecutionRole } from './iam'
import { ENV } from '../../env'
import { SecurityGroup } from '@pulumi/aws/ec2'
import { Output } from '@pulumi/pulumi'
import { TargetGroup } from '@pulumi/aws/alb'
import path from 'path'

export const getECRImage = async (type: 'web' | 'server') => {
  const options = {
    web: {
      ecrRepoName: ENV.ecrWebRepositoryName,
      imageName: 'web-image',
      path: '../packages/velog-web/',
    },
    server: {
      ecrRepoName: ENV.ecrServerRepositoryName,
      imageName: 'server-image',
      path: '../packages/velog-server/',
    },
  }

  const option = options[type]
  const repo = await aws.ecr.getRepository({
    name: option.ecrRepoName,
  })

  return new awsx.ecr.Image(withPrefix(option.imageName), {
    repositoryUrl: repo.repositoryUrl,
    path: path.resolve(process.cwd(), option.path),
  })
}

const serverEcsOption: EcsOption = {
  desiredCount: 1,
  cpu: 256,
  memory: 512,
  maxCapacity: 1,
  minCapacity: ENV.isProduction ? 3 : 1,
}

const webEcsOption: EcsOption = {
  desiredCount: 1,
  cpu: 256,
  memory: 512,
  maxCapacity: 1,
  minCapacity: ENV.isProduction ? 3 : 1,
}

const ecsOption = {
  web: webEcsOption,
  server: serverEcsOption,
}

export const createECSfargateService = ({
  image,
  subnetIds,
  taskSecurityGroup,
  targetGroup,
  port,
  type,
}: CreateECSFargateParams) => {
  const cluster = new aws.ecs.Cluster(withPrefix('cluster'))
  const option = ecsOption[type]
  const service = new awsx.ecs.FargateService(withPrefix('fargate-service'), {
    cluster: cluster.arn,
    desiredCount: option.desiredCount,
    networkConfiguration: {
      assignPublicIp: true,
      securityGroups: [taskSecurityGroup.id],
      subnets: subnetIds,
    },
    taskDefinitionArgs: {
      executionRole: {
        roleArn: ecsTaskExecutionRole.arn,
      },
      container: {
        cpu: option.cpu,
        memory: option.memory,
        image: image.imageUri,
        essential: true,
        portMappings: [{ targetGroup: targetGroup }],
        environment: [
          {
            name: 'PORT',
            value: String(port),
          },
          {
            name: 'APP_ENV',
            value: ENV.appEnv,
          },
          {
            name: 'NODE_ENV',
            value: ENV.isProduction ? 'production' : 'development',
          },
          {
            name: 'AWS_ACCESS_KEY_ID',
            value: ENV.awsAccessKeyId,
          },
          {
            name: 'AWS_SECRET_ACCESS_KEY',
            value: ENV.awsSecretAccessKey,
          },
        ],
      },
    },
  })

  const resourceId = service.service.id.apply((t) => t.split(':').at(-1)!)
  const ecsTarget = new aws.appautoscaling.Target(withPrefix('ecs-target'), {
    maxCapacity: option.maxCapacity,
    minCapacity: option.minCapacity,
    resourceId: resourceId,
    scalableDimension: 'ecs:service:DesiredCount',
    serviceNamespace: 'ecs',
  })

  const ecsCPUPolicy = new aws.appautoscaling.Policy(withPrefix('ecs-cpu-policy'), {
    policyType: 'TargetTrackingScaling',
    resourceId: ecsTarget.resourceId,
    scalableDimension: ecsTarget.scalableDimension,
    serviceNamespace: ecsTarget.serviceNamespace,
    targetTrackingScalingPolicyConfiguration: {
      predefinedMetricSpecification: {
        predefinedMetricType: 'ECSServiceAverageCPUUtilization',
      },
      targetValue: 50,
      scaleInCooldown: 60,
      scaleOutCooldown: 60,
    },
  })

  const ecsMemoryPolicy = new aws.appautoscaling.Policy(withPrefix('ecs-memory-policy'), {
    policyType: 'TargetTrackingScaling',
    resourceId: ecsTarget.resourceId,
    scalableDimension: ecsTarget.scalableDimension,
    serviceNamespace: ecsTarget.serviceNamespace,
    targetTrackingScalingPolicyConfiguration: {
      predefinedMetricSpecification: {
        predefinedMetricType: 'ECSServiceAverageMemoryUtilization',
      },
      targetValue: 50,
      scaleInCooldown: 60,
      scaleOutCooldown: 60,
    },
  })
}
type CreateECSFargateParams = {
  image: awsx.ecr.Image
  subnetIds: Output<string>[]
  taskSecurityGroup: SecurityGroup
  targetGroup: TargetGroup
  port: number
  type: 'web' | 'server'
}

type EcsOption = {
  desiredCount: number
  cpu: number
  memory: number
  maxCapacity: number
  minCapacity: number
}
