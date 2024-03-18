import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as clientEcs from '@aws-sdk/client-ecs'
import { withPrefix } from '../lib/prefix'
import { ecsTaskExecutionRole } from './iam'
import { ENV } from '../env'
import { CreateECSFargateParams } from '../type'
import { portMapper } from '../lib/portMapper'
import { ecsOption } from '../lib/ecsOptions'

const ecsClient = new clientEcs.ECS({ region: 'ap-northeast-2' })

export const getCluster = async () => {
  const clusterList = await ecsClient.listClusters({})
  const arn = clusterList.clusterArns?.find((arn) => arn.includes(withPrefix('cluster')))
  const cluster = new aws.ecs.Cluster(withPrefix('cluster'), {}, { import: arn })
  return cluster
}

export const createECSfargateService = ({
  imageUri,
  subnetIds,
  taskSecurityGroup,
  defaultSecurityGroupId,
  targetGroup,
  packageType,
  cluster,
}: CreateECSFargateParams) => {
  const option = ecsOption[packageType]
  const port = portMapper[packageType]

  const service = new awsx.ecs.FargateService(
    withPrefix(`${packageType}-fargate-service`),
    {
      cluster: cluster.arn,
      desiredCount: option.desiredCount,
      networkConfiguration: {
        assignPublicIp: true,
        securityGroups: [defaultSecurityGroupId, taskSecurityGroup.id],
        subnets: subnetIds,
      },
      taskDefinitionArgs: {
        // TODO: Ignore changes for taskDefinitionArgs.cpu, memory
        // cpu: option.taskCpu,
        // memory: option.taskMemory,
        executionRole: {
          roleArn: ecsTaskExecutionRole.arn,
        },
        container: {
          // name: withPrefix(`${packageType}-container`),
          image: imageUri,
          cpu: option.containerCpu,
          memory: option.containerMemory,
          essential: true,
          portMappings: [{ targetGroup: targetGroup }],
          environment: [
            {
              name: 'PORT',
              value: port.toString(),
            },
            {
              name: 'DOCKER_ENV',
              value: ENV.dockerEnv,
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
    },
    {
      replaceOnChanges: ['taskDefinitionArgs.container.image'],
    },
  )

  const resourceId = service.service.id.apply((t) => t.split(':').at(-1)!)
  const ecsTarget = new aws.appautoscaling.Target(
    withPrefix(`${packageType}-ecs-target`),
    {
      maxCapacity: option.maxCapacity,
      minCapacity: option.minCapacity,
      resourceId: resourceId,
      scalableDimension: 'ecs:service:DesiredCount',
      serviceNamespace: 'ecs',
    },
    // { replaceOnChanges: ['resourceId'] },
  )

  const ecsCPUPolicy = new aws.appautoscaling.Policy(
    withPrefix(`${packageType}-ecs-cpu-policy`),
    {
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
    },
    // { replaceOnChanges: ['resourceId'] },
  )

  const ecsMemoryPolicy = new aws.appautoscaling.Policy(
    withPrefix(`${packageType}-ecs-memory-policy`),
    {
      policyType: 'TargetTrackingScaling',
      resourceId: ecsTarget.resourceId,
      scalableDimension: ecsTarget.scalableDimension,
      serviceNamespace: ecsTarget.serviceNamespace,
      targetTrackingScalingPolicyConfiguration: {
        predefinedMetricSpecification: {
          predefinedMetricType: 'ECSServiceAverageMemoryUtilization',
        },
        targetValue: 70,
        scaleInCooldown: 60,
        scaleOutCooldown: 60,
      },
    },
    // { replaceOnChanges: ['resourceId'] },
  )
}
