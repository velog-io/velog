import { ENV } from '../../env'
import { CreateInfraParameter } from '../../type'
import { createECSfargateService } from '../../common/ecs'
import { createLoadBalancer } from '../../common/loadBalancer'
import { createSecurityGroup } from '../../common/securityGroup'

export const createServerInfra = ({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
  repositoryUrl,
}: CreateInfraParameter) => {
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({
    vpcId,
    packageType: 'server',
  })

  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    vpcId,
    certificateArn,
    packageType: 'server',
  })

  createECSfargateService({
    packageType: 'server',
    repositoryUrl: repositoryUrl,
    port: ENV.serverPort,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
  })
}
