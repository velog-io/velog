import { ENV } from '../../env'
import { CreateInfraParameter } from '../type'
import { getECRImage } from './../common/ecr'
import { createECSfargateService } from './../common/ecs'
import { createLoadBalancer } from './../common/loadBalancer'
import { createSecurityGroup } from './../common/securityGroup'

export const createWebInfra = ({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
}: CreateInfraParameter) => {
  const { image, repoUrl } = getECRImage('web')
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({ vpcId, packageType: 'web' })
  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    vpcId,
    certificateArn,
    packageType: 'web',
  })
  createECSfargateService({
    packageType: 'web',
    image,
    port: ENV.webPort,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
  })

  return { repoUrl }
}
