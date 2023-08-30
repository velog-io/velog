import { ENV } from '../../env'
import { CreateInfraParameter } from '../../type'
import { getECRImage } from '../../common/ecr'
import { createECSfargateService } from '../../common/ecs'
import { createLoadBalancer } from '../../common/loadBalancer'
import { createSecurityGroup } from '../../common/securityGroup'

export const createServerInfra = ({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
  protect,
}: CreateInfraParameter) => {
  const { image, repoUrl } = getECRImage('server')
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({
    vpcId,
    packageType: 'server',
    protect,
  })

  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    vpcId,
    certificateArn,
    packageType: 'server',
    protect,
  })

  createECSfargateService({
    packageType: 'server',
    image: image,
    port: ENV.serverPort,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
    protect,
  })

  return { repoUrl }
}
