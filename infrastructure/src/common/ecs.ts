import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as pulumi from '@pulumi/pulumi'

import { withPrefix } from '../lib/prefix'
import { ecsTaskExecutionRole } from './iam'
import { ENV } from '../../env'
import { SecurityGroup } from '@pulumi/aws/ec2'
import { TargetGroup } from '@pulumi/aws/alb'

const serverEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
  cpu: 256,
  memory: 512,
  maxCapacity: 1,
  minCapacity: ENV.isProduction ? 3 : 1,
}

const webEcsOption: EcsOption = {
  desiredCount: ENV.isProduction ? 2 : 1,
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
  defaultSecurityGroupId,
  targetGroup,
  port,
  type,
}: CreateECSFargateParams) => {
  const option = ecsOption[type]
  const cluster = new aws.ecs.Cluster(withPrefix(`${type}-cluster`))
  const service = new awsx.ecs.FargateService(withPrefix('fargate-service'), {
    cluster: cluster.arn,
    desiredCount: option.desiredCount,
    networkConfiguration: {
      assignPublicIp: true,
      securityGroups: [defaultSecurityGroupId, taskSecurityGroup.id],
      subnets: subnetIds,
    },
    taskDefinitionArgs: {
      executionRole: {
        roleArn: ecsTaskExecutionRole.arn,
      },
      container: {
        image: image.imageUri,
        cpu: option.cpu,
        memory: option.memory,
        essential: true,
        portMappings: [{ targetGroup: targetGroup }],
        environment: [
          {
            name: 'PORT',
            value: port.toString(),
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
  const ecsTarget = new aws.appautoscaling.Target(withPrefix(`${type}-ecs-target`), {
    maxCapacity: option.maxCapacity,
    minCapacity: option.minCapacity,
    resourceId: resourceId,
    scalableDimension: 'ecs:service:DesiredCount',
    serviceNamespace: 'ecs',
  })

  const ecsCPUPolicy = new aws.appautoscaling.Policy(withPrefix(`${type}-ecs-cpu-policy`), {
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

  const ecsMemoryPolicy = new aws.appautoscaling.Policy(withPrefix(`${type}-ecs-memory-policy`), {
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
  subnetIds: pulumi.Input<pulumi.Input<string>[]>
  taskSecurityGroup: SecurityGroup
  defaultSecurityGroupId: Promise<string>
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
