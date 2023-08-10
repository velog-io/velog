import { ENV } from './env'

import { createECSfargateService } from './src/common/ecs'
import { getECRImage } from './src/common/ecr'
import { serverTargetGroup } from './src/server/loadBalancer'
import {
  defaultSecurityGroupId as dsgId,
  serverTaskSecurityGroup,
} from './src/server/securityGroup'

import './src/common'
import { serverSubnet } from './src/common/vpc'

export const defaultSecurityGroupId = dsgId
// server
const { image: serverImage, repoUrl: serverRepoUrl } = getECRImage('server')

export const repoUrl = serverRepoUrl

const serverSubnetIds = serverSubnet.apply((subnet) => subnet.map((s) => s.id))

createECSfargateService({
  image: serverImage,
  port: ENV.serverPort,
  subnetIds: serverSubnetIds,
  targetGroup: serverTargetGroup,
  taskSecurityGroup: serverTaskSecurityGroup,
  type: 'server',
})
