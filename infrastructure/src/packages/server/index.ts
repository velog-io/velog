import { getCertificate } from '../../common/certificate'
import { ENV } from '../../../env'
import { CreateInfraParameter } from '../../type'
import { getECRImage } from '../../common/ecr'
import { createECSfargateService } from '../../common/ecs'
import { createLoadBalancer } from '../../common/loadBalancer'
import { createSecurityGroup } from '../../common/securityGroup'

export const createServerInfra = ({
  vpcId,
  subnetIds,
  defaultSecurityGroupId,
}: CreateInfraParameter) => {
  const { image, repoUrl } = getECRImage('server')
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({
    vpcId,
    packageType: 'server',
  })

  const certificateArn = getCertificate(ENV.certificateServerDomain)

  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    vpcId,
    certificateArn,
    packageType: 'server',
  })
  createECSfargateService({
    packageType: 'server',
    image: image,
    port: ENV.serverPort,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
  })

  return { repoUrl, certificateArn }
}
