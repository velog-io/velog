import { ENV } from './env'

import * as pulumi from '@pulumi/pulumi'
import * as docker from '@pulumi/docker'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import path from 'path'

const config = new pulumi.Config()

const appEnv = config.require('APP_ENV')
const prefix = `${config.name}-${appEnv}`

// const registryInfo = repo.registryId.apply(async (id) => {
//   const credentials = await aws.ecr.getCredentials({ registryId: id })
//   const decodedCredentials = Buffer.from(credentials.authorizationToken, 'base64').toString()
//   const [username, password] = decodedCredentials.split(':')

//   if (!password || !username) {
//     throw new Error('Invalid credentials')
//   }
//   return {
//     server: credentials.proxyEndpoint,
//     username: username,
//     password: password,
//   }
// })

const withPrefix = (name: string) => `${prefix}-${name}`
const repo = new aws.ecr.Repository(ENV.ecrServerRepositoryName, { forceDelete: true })
const authToken = aws.ecr.getAuthorizationTokenOutput({
  registryId: repo.registryId.apply((id) => id),
})

const decodedToken = authToken.authorizationToken.apply((token) => {
  const base64Decoded = Buffer.from(token, 'base64').toString()
  const parts = base64Decoded.split(':')
  return {
    username: parts[0],
    password: parts[1],
  }
})

export const decodedToken2 = decodedToken

const context = path.resolve(__dirname, '../packages/velog-server')
const image = new docker.Image(withPrefix('image'), {
  imageName: pulumi.interpolate`${repo.repositoryUrl}:latest`,
  build: {
    context: path.resolve(__dirname, '../packages/velog-server'),
    // builderVersion: 'BuilderBuildKit',
    // cacheFrom: {
    //   images: [pulumi.interpolate`${repo.repositoryUrl}:latest`],
    // },
    platform: 'linux/amd64',
  },
  registry: {
    server: repo.repositoryUrl,
    username: decodedToken.username,
    password: decodedToken.password,
  },
})
// Export the resulting image name
export const imageName = image.imageName
export const repoDigest = image.repoDigest
export const repoUrl = repo.id.apply((id) => id)
export const password = authToken.apply((authToken) => authToken.password)
export const userName = authToken.apply((authToken) => authToken.userName)

// const defaultVpc = aws.ec2.getVpc({ default: true })
// const defaultSecurityGroup = defaultVpc.then((vpc) =>
//   aws.ec2.getSecurityGroup({
//     vpcId: vpc.id,
//     name: 'default',
//   })
// )

// export const defaultSecurityGroupId = defaultSecurityGroup.then((sg) => sg.id)

// const cluster = new aws.ecs.Cluster(withPrefix('cluster'), {})
// const elbSecurityGroup = new aws.ec2.SecurityGroup(withPrefix('elb-sg'), {
//   description: 'Allow traffic from the internet',
//   ingress: [
//     {
//       fromPort: 80,
//       toPort: 80,
//       protocol: 'tcp',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//     {
//       fromPort: 443,
//       toPort: 443,
//       protocol: 'tcp',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//   ],
//   egress: [
//     {
//       fromPort: 0,
//       toPort: 0,
//       protocol: '-1',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//   ],
// })

// const subnets = aws.ec2.getSubnets()
// const subnetIds = subnets.then((subnets) => subnets.ids)

// const certificate = aws.acm.getCertificate({
//   domain: ENV.certificateDomain,
// })
// const certificateArn = certificate.then((certificate) => certificate.arn)

// const loadBalancer = new aws.lb.LoadBalancer(withPrefix('lb'), {
//   // application load balancer
//   loadBalancerType: 'application',
//   securityGroups: [elbSecurityGroup.id],
//   subnets: subnetIds,
// })

// const targetGroup = new aws.lb.TargetGroup(withPrefix('tg'), {
//   port: ENV.serverPort,
//   protocol: 'HTTP',
//   targetType: 'ip',
//   vpcId: loadBalancer.vpcId,
// })

// const httpsListener = new aws.lb.Listener(withPrefix('https-listener'), {
//   loadBalancerArn: loadBalancer.arn,
//   protocol: 'HTTPS',
//   port: 443,
//   certificateArn,
//   sslPolicy: 'ELBSecurityPolicy-2016-08',
//   defaultActions: [
//     {
//       type: 'forward',
//       targetGroupArn: targetGroup.arn,
//     },
//   ],
// })

// const httpListener = new aws.lb.Listener(withPrefix('http-listener'), {
//   loadBalancerArn: loadBalancer.arn,
//   port: 80,
//   defaultActions: [
//     {
//       type: 'redirect',
//       redirect: {
//         port: '443',
//         protocol: 'HTTPS',
//         statusCode: 'HTTP_301',
//       },
//     },
//   ],
// })

// const taskSecurityGroup = new aws.ec2.SecurityGroup(withPrefix('task-sg'), {
//   description: 'Allow traffic from the load balancer',
//   ingress: [
//     {
//       fromPort: ENV.serverPort,
//       toPort: ENV.serverPort,
//       protocol: 'tcp',
//       securityGroups: [elbSecurityGroup.id],
//     },
//   ],
//   egress: [
//     {
//       fromPort: 0,
//       toPort: 0,
//       protocol: '-1',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//   ],
// })

// const ecsTaskExecutionRole = new aws.iam.Role(withPrefix('te-role'), {
//   assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
//     Service: 'ecs-tasks.amazonaws.com',
//   }),
// })

// const ecsTaskExecutionRolePolicy = new aws.iam.RolePolicy(
//   withPrefix('task-execution-role-policy'),
//   {
//     role: ecsTaskExecutionRole.id,
//     // allow access to ssm parameter
//     policy: {
//       Version: '2012-10-17',
//       Statement: [
//         {
//           Effect: 'Allow',
//           Action: ['ssm:Describe*', 'ssm:Get*', 'ssm:List*'],
//           Resource: '*',
//         },
//         {
//           Effect: 'Allow',
//           Action: 'ecr:GetAuthorizationToken',
//           Resource: '*',
//         },
//         {
//           Effect: 'Allow',
//           Action: ['logs:*', 'ecr:*'],
//           Resource: '*',
//         },
//       ],
//     },
//   }
// )

// const service = new awsx.ecs.FargateService(withPrefix('service'), {
//   cluster: cluster.arn,
//   desiredCount: 1,
//   networkConfiguration: {
//     assignPublicIp: true,
//     securityGroups: [defaultSecurityGroupId, taskSecurityGroup.id],
//     subnets: subnetIds,
//   },
//   taskDefinitionArgs: {
//     executionRole: {
//       roleArn: ecsTaskExecutionRole.arn,
//     },
//     container: {
//       image: image.imageUri,
//       cpu: 512,
//       memory: 1024,
//       essential: true,
//       portMappings: [
//         {
//           targetGroup: targetGroup,
//         },
//       ],
//       environment: [
//         {
//           name: 'PORT',
//           value: ENV.serverPort.toString(),
//         },
//         {
//           name: 'NODE_ENV',
//           value: ENV.isProduction ? 'production' : 'development',
//         },
//         {
//           name: 'APP_ENV',
//           value: ENV.appEnv,
//         },
//         {
//           name: 'NODE_ENV',
//           value: ENV.isProduction ? 'production' : 'development',
//         },
//         {
//           name: 'AWS_ACCESS_KEY_ID',
//           value: ENV.awsAccessKeyId,
//         },
//         {
//           name: 'AWS_SECRET_ACCESS_KEY',
//           value: ENV.awsSecretAccessKey,
//         },
//       ],
//     },
//   },
// })

// const resourceId = service.service.id.apply((t) => t.split(':').at(-1)!)

// const ecsTarget = new aws.appautoscaling.Target(withPrefix('ecs-target'), {
//   maxCapacity: 8,
//   minCapacity: ENV.isProduction ? 3 : 1,
//   resourceId: resourceId,
//   scalableDimension: 'ecs:service:DesiredCount',
//   serviceNamespace: 'ecs',
// })

// const ecsCPUPolicy = new aws.appautoscaling.Policy(withPrefix('ecs-cpu-policy'), {
//   policyType: 'TargetTrackingScaling',
//   resourceId: ecsTarget.resourceId,
//   scalableDimension: ecsTarget.scalableDimension,
//   serviceNamespace: ecsTarget.serviceNamespace,
//   targetTrackingScalingPolicyConfiguration: {
//     predefinedMetricSpecification: {
//       predefinedMetricType: 'ECSServiceAverageCPUUtilization',
//     },
//     targetValue: 50,
//     scaleInCooldown: 60,
//     scaleOutCooldown: 60,
//   },
// })

// const ecsMemoryPolicy = new aws.appautoscaling.Policy(withPrefix('ecs-memory-policy'), {
//   policyType: 'TargetTrackingScaling',
//   resourceId: ecsTarget.resourceId,
//   scalableDimension: ecsTarget.scalableDimension,
//   serviceNamespace: ecsTarget.serviceNamespace,
//   targetTrackingScalingPolicyConfiguration: {
//     predefinedMetricSpecification: {
//       predefinedMetricType: 'ECSServiceAverageMemoryUtilization',
//     },
//     targetValue: 50,
//     scaleInCooldown: 60,
//     scaleOutCooldown: 60,
//   },
// })
