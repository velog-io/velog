import { subnets } from './subnet'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'

import { prefix } from '../../lib/prefix'
import { taskSecurityGroup } from '../securityGroup'
import { ecsTaskExecutionRole } from '../iam'
import { ENV } from '../../env'
import { lb } from './loadBalancer'

export const getLatestImage = (repo: aws.ecr.GetRepositoryResult) => `${repo.repositoryUrl}:latest`

export const createECSfargateService = (ecrImageName: string) => {
  const cluster = new aws.ecs.Cluster(`${prefix}-cluster`)
  new awsx.ecs.FargateService(`${prefix}-service`, {
    cluster: cluster.arn,
    networkConfiguration: {
      assignPublicIp: true,
      securityGroups: [taskSecurityGroup.id],
      subnets,
    },
    desiredCount: 2,
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
            value: ENV.port.toString(),
          },
          {
            name: 'APP_ENV',
            value: ENV.appEnv,
          },
          {
            name: 'NODE_ENV',
            value: ENV.appEnv === 'production' ? 'production' : 'development',
          },
        ],
        // secrets: [
        //   {
        //     valueFrom: databaseUrl.arn,
        //     name: "DATABASE_URL",
        //   },
        // ],
      },
    },
  })

  const url = lb.loadBalancer.dnsName
  return url
}
