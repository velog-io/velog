import { ENV } from './env'

import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'

const config = new pulumi.Config()

const appEnv = config.require('APP_ENV')
const prefix = `${config.name}-${appEnv}`

const withPrefix = (name: string) => `${prefix}-${name}`
const repository = new awsx.ecr.Repository(ENV.ecrServerRepositoryName, { forceDelete: true })
const image = new awsx.ecr.Image(withPrefix('image'), {
  repositoryUrl: repository.url,
  path: '../packages/velog-server/',
})

export const repoUrl = repository.url.apply((id) => id)

const defaultVpc = aws.ec2.getVpc({ default: true })
const defaultSecurityGroup = defaultVpc.then((vpc) =>
  aws.ec2.getSecurityGroup({
    vpcId: vpc.id,
    name: 'default',
  })
)

export const defaultSecurityGroupId = defaultSecurityGroup.then((sg) => sg.id)

const cluster = new aws.ecs.Cluster(withPrefix('cluster'), {})
const elbSecurityGroup = new aws.ec2.SecurityGroup(withPrefix('elb-sg'), {
  description: 'Allow traffic from the internet',
  ingress: [
    {
      fromPort: 80,
      toPort: 80,
      protocol: 'tcp',
      cidrBlocks: ['0.0.0.0/0'],
    },
    {
      fromPort: 443,
      toPort: 443,
      protocol: 'tcp',
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: '-1',
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
})

const subnets = aws.ec2.getSubnets()
const subnetIds = subnets.then((subnets) => subnets.ids)

const certificate = aws.acm.getCertificate({
  domain: ENV.certificateDomain,
})
const certificateArn = certificate.then((certificate) => certificate.arn)

const loadBalancer = new aws.lb.LoadBalancer(withPrefix('lb'), {
  // application load balancer
  loadBalancerType: 'application',
  securityGroups: [elbSecurityGroup.id],
  subnets: subnetIds,
})

const targetGroup = new aws.lb.TargetGroup(withPrefix('tg'), {
  port: ENV.serverPort,
  protocol: 'HTTP',
  targetType: 'ip',
  vpcId: loadBalancer.vpcId,
})

const httpsListener = new aws.lb.Listener(withPrefix('https-listener'), {
  loadBalancerArn: loadBalancer.arn,
  protocol: 'HTTPS',
  port: 443,
  certificateArn,
  sslPolicy: 'ELBSecurityPolicy-2016-08',
  defaultActions: [
    {
      type: 'forward',
      targetGroupArn: targetGroup.arn,
    },
  ],
})

const httpListener = new aws.lb.Listener(withPrefix('http-listener'), {
  loadBalancerArn: loadBalancer.arn,
  port: 80,
  defaultActions: [
    {
      type: 'redirect',
      redirect: {
        port: '443',
        protocol: 'HTTPS',
        statusCode: 'HTTP_301',
      },
    },
  ],
})

const taskSecurityGroup = new aws.ec2.SecurityGroup(withPrefix('task-sg'), {
  description: 'Allow traffic from the load balancer',
  ingress: [
    {
      fromPort: ENV.serverPort,
      toPort: ENV.serverPort,
      protocol: 'tcp',
      securityGroups: [elbSecurityGroup.id],
    },
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: '-1',
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
})

const ecsTaskExecutionRole = new aws.iam.Role(withPrefix('te-role'), {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'ecs-tasks.amazonaws.com',
  }),
})

const ecsTaskExecutionRolePolicy = new aws.iam.RolePolicy(
  withPrefix('task-execution-role-policy'),
  {
    role: ecsTaskExecutionRole.id,
    // allow access to ssm parameter
    policy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: ['ssm:Describe*', 'ssm:Get*', 'ssm:List*'],
          Resource: '*',
        },
        {
          Effect: 'Allow',
          Action: 'ecr:GetAuthorizationToken',
          Resource: '*',
        },
        {
          Effect: 'Allow',
          Action: ['logs:*', 'ecr:*'],
          Resource: '*',
        },
      ],
    },
  }
)

const service = new awsx.ecs.FargateService(withPrefix('service'), {
  cluster: cluster.arn,
  desiredCount: 2,
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
      cpu: 512,
      memory: 1024,
      essential: true,
      portMappings: [
        {
          targetGroup: targetGroup,
        },
      ],
      environment: [
        {
          name: 'PORT',
          value: ENV.serverPort.toString(),
        },
        {
          name: 'NODE_ENV',
          value: ENV.isProduction ? 'production' : 'development',
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
  maxCapacity: 8,
  minCapacity: ENV.isProduction ? 3 : 1,
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
