import { ENV } from '../../env'
import { CreateInfraParameter } from '../../type'
import { createECSfargateService } from '../../common/ecs'
import { createLoadBalancer } from '../../common/loadBalancer'
import { createSecurityGroup } from '../../common/securityGroup'

export const createWebInfra = ({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
  imageUri,
  cluster,
}: CreateInfraParameter) => {
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({
    vpcId,
    packageType: 'web',
  })

  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    defaultSecurityGroupId,
    vpcId,
    certificateArn,
    packageType: 'web',
  })

  createECSfargateService({
    packageType: 'web',
    imageUri,
    port: ENV.webV3Port,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
    cluster,
  })
}
