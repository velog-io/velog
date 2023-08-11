import { ENV } from './env'
import * as aws from '@pulumi/aws'

import { getECRImage } from './src/common/ecr'
import { createServerLoadBalancer } from './src/server/loadBalancer'
import { serverSecurityGroup } from './src/server/securityGroup'
import { createECSfargateService } from './src/common/ecs'
import { createVPC } from './src/common/vpc'

// createVPC
const { serverSubnet, vpc } = createVPC()

export const vpcId = vpc.then((v) => v.id)
export const serverSubnetIds = serverSubnet.then((subnets) => subnets.ids)

const { image: serverImage, repoUrl: serverRepoUrl } = getECRImage('server')
export const repoUrl = serverRepoUrl

const defaultSecurityGroup = vpcId.then((id) =>
  aws.ec2.getSecurityGroup({
    vpcId: id,
    name: 'default',
  })
)

export const defaultSecurityGroupId = defaultSecurityGroup.then((sg) => sg.id)

const certificate = aws.acm.getCertificate({
  domain: ENV.certificateDomain,
})
export const certificateArn = certificate.then((certificate) => certificate.arn)

const { serverElbSecurityGroup, serverTaskSecurityGroup } = serverSecurityGroup(vpcId)
const { serverTargetGroup } = createServerLoadBalancer(
  serverSubnetIds,
  serverElbSecurityGroup,
  vpcId,
  certificateArn
)

createECSfargateService({
  type: 'server',
  image: serverImage,
  port: ENV.serverPort,
  subnetIds: serverSubnetIds,
  targetGroup: serverTargetGroup,
  defaultSecurityGroupId: defaultSecurityGroupId,
  taskSecurityGroup: serverTaskSecurityGroup,
})
