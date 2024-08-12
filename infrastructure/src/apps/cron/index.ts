import { ENV } from '../../env'
import { createECSfargateService } from '../../common/ecs'
import { createSecurityGroup } from '../../common/securityGroup'
import { CreateInfraParameter } from '../../type'
import { createLoadBalancer } from '../../common/loadBalancer'

export const createCronInfra = ({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
  imageUri,
  cluster,
}: CreateInfraParameter) => {
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({
    vpcId,
    packageType: 'cron',
  })

  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    defaultSecurityGroupId,
    vpcId,
    certificateArn,
    packageType: 'cron',
  })

  createECSfargateService({
    packageType: 'cron',
    imageUri,
    port: ENV.serverPort,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
    cluster,
  })
}
