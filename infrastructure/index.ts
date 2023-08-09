import { ENV } from './env'
import * as aws from '@pulumi/aws'
import { createECSfargateService, getECRImage } from './src/common/ecs'
import { serverSubnetIds } from './src/server/subnet'
import { serverTargetGroup } from './src/server/loadBalancer'
import { serverTaskSecurityGroup } from './src/server/securityGroup'

// import './src/common'
// import './src/server'

export = async () => {
  // server
  const serverImage = await getECRImage('server')
  createECSfargateService({
    image: serverImage,
    port: ENV.serverPort,
    subnetIds: serverSubnetIds,
    targetGroup: serverTargetGroup,
    taskSecurityGroup: serverTaskSecurityGroup,
    type: 'server',
  })
}
