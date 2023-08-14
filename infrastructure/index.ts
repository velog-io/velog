import { createWebInfra } from './src/web/index'
import { createServerInfra } from './src/server/index'
import { ENV } from './env'
import * as aws from '@pulumi/aws'

import { createVPC } from './src/common/vpc'

// VPC, Subnet, DHCP, Intergate way, route Table
const { subnets, vpc } = createVPC()
export const vpcId = vpc.then((v) => v.id)
export const subnetIds = subnets.then((subnets) => subnets.ids)

// Security Group
const defaultSecurityGroup = vpcId.then((id) =>
  aws.ec2.getSecurityGroup({
    vpcId: id,
    name: 'default',
  })
)
export const defaultSecurityGroupId = defaultSecurityGroup.then((sg) => sg.id)

// Certificate
const certificate = aws.acm.getCertificate({
  domain: ENV.certificateDomain,
})
export const certificateArn = certificate.then((certificate) => certificate.arn)

// Create Sever Infra
export const { repoUrl: serverRepoUrl } = createServerInfra({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
})

// Create WEB Infra
export const { repoUrl: webRepoUrl } = createWebInfra({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
})
