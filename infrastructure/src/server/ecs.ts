import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'

import { prefix } from '../../lib/prefix'
import { taskSecurityGroup } from './securityGroup'
import { ecsTaskExecutionRole } from '../common/iam'
import { ENV } from '../../env'
import { lb } from './loadBalancer'
import { serverSubnetIds } from '../common/vpc'

export const getLatestImage = (repo: aws.ecr.GetRepositoryResult) => `${repo.repositoryUrl}:latest`

export const createECSfargateService = (ecrImageName: string) => {
  const cluster = new aws.ecs.Cluster(`${prefix}-cluster`)
  new awsx.ecs.FargateService(`${prefix}-service`, {
    cluster: cluster.arn,
    networkConfiguration: {
      assignPublicIp: false,
      securityGroups: [taskSecurityGroup.id],
      subnets: serverSubnetIds,
    },
    desiredCount: 1,
    taskDefinitionArgs: {
      executionRole: {
        roleArn: ecsTaskExecutionRole.arn,
      },
      container: {
        cpu: 256,
        memory: 512,
        image: ecrImageName,
        essential: true,
        portMappings: [{ targetGroup: lb.defaultTargetGroup }],
        environment: [
          {
            name: 'PORT',
            value: String(ENV.port),
          },
          {
            name: 'APP_ENV',
            value: ENV.appEnv,
          },
          {
            name: 'NODE_ENV',
            value: ENV.appEnv === 'production' ? 'production' : 'development',
          },
          {
            name: 'AWS_ACCESS_KEY_ID',
            value: process.env.AWS_ACCESS_KEY_ID,
          },
          {
            name: 'AWS_SECRET_ACCESS_KEY',
            value: process.env.AWS_SECRET_ACCESS_KEY,
          },
        ],
      },
    },
  })

  const url = lb.loadBalancer.dnsName
  return url
}
