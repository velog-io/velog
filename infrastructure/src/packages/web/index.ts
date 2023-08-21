import { ENV } from '../../../env'
import { getCertificate } from '../../common/certificate'
import { CreateInfraParameter } from '../../type'
import { getECRImage } from '../../common/ecr'
import { createECSfargateService } from '../../common/ecs'
import { createLoadBalancer } from '../../common/loadBalancer'
import { createSecurityGroup } from '../../common/securityGroup'

export const createWebInfra = ({
  vpcId,
  subnetIds,
  defaultSecurityGroupId,
}: CreateInfraParameter) => {
  const { image, repoUrl } = getECRImage('web')
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({ vpcId, packageType: 'web' })

  const certificateArn = getCertificate(ENV.certificateWebDomain)

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
