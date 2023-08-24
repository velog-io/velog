import { createWebInfra } from './src/packages/web/index'
import { createServerInfra } from './src/packages/server/index'
import { ENV } from './env'
import * as aws from '@pulumi/aws'

import { createVPC } from './src/common/vpc'
import { getCertificate } from './src/common/certificate'
import { createCronInfra } from './src/packages/cron'
import { execCommand } from './src/lib/execCommand'

execCommand('pnpm -r prisma:copy')

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

const certificateArn = getCertificate(ENV.certificateDomain)

// Create SEVER Infra
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

// Create CRON Infra
export const { repoUrl: cronRepoUrl } = createCronInfra({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
})

execCommand('pnpm -r prisma:rm')
