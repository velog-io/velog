import { ENV } from './env'
import * as aws from '@pulumi/aws'

import { getECRImage } from './src/common/ecr'
import { createLoadBalancer } from './src/common/loadBalancer'
import { createSecurityGroup } from './src/common/securityGroup'
import { createECSfargateService } from './src/common/ecs'
import { createVPC } from './src/common/vpc'

// createVPC
const { subnets, vpc } = createVPC()

export const vpcId = vpc.then((v) => v.id)
export const subnetIds = subnets.then((subnets) => subnets.ids)

const { image: serverImage, repoUrl: serverRepoUrl } = getECRImage('server')
export const serverImageUrl = serverRepoUrl

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

const { elbSecurityGroup: serverElbSecurityGroup, taskSecurityGroup: serverTaskSecurityGroup } =
  createSecurityGroup(vpcId, 'server')

const { targetGroup: serverTargetGroup } = createLoadBalancer(
  subnetIds,
  serverElbSecurityGroup,
  vpcId,
  certificateArn,
  'server'
)

createECSfargateService({
  type: 'server',
  image: serverImage,
  port: ENV.serverPort,
  subnetIds: subnetIds,
  targetGroup: serverTargetGroup,
  defaultSecurityGroupId: defaultSecurityGroupId,
  taskSecurityGroup: serverTaskSecurityGroup,
})

// create WEB
const { image: webImage, repoUrl: webRepoUrl } = getECRImage('web')

export const webImageUrl = webRepoUrl

const { elbSecurityGroup: webElbSecurityGroup, taskSecurityGroup: webTaskSecurityGroup } =
  createSecurityGroup(vpcId, 'web')

const { targetGroup: webTargetGroup } = createLoadBalancer(
  subnetIds,
  webElbSecurityGroup,
  vpcId,
  certificateArn,
  'web'
)

createECSfargateService({
  type: 'web',
  image: webImage,
  port: ENV.webPort,
  subnetIds: subnetIds,
  targetGroup: webTargetGroup,
  defaultSecurityGroupId: defaultSecurityGroupId,
  taskSecurityGroup: webTaskSecurityGroup,
})
