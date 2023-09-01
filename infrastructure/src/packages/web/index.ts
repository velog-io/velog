import { ENV } from '../../env'
import { CreateInfraParameter } from '../../type'
import { getECRImage } from '../../common/ecr'
import { createECSfargateService } from '../../common/ecs'
import { createLoadBalancer } from '../../common/loadBalancer'
import { createSecurityGroup } from '../../common/securityGroup'
import { withPrefix } from '../../lib/prefix'
import aws from '@pulumi/aws'

export const createWebInfra = ({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
  protect,
}: CreateInfraParameter) => {
  const { image, repoUrl } = getECRImage({ type: 'web', protect })
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({
    vpcId,
    packageType: 'web',
    protect,
  })

  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    vpcId,
    certificateArn,
    packageType: 'web',
    protect,
  })

  const targetGroupName = withPrefix('web-tg2')
  const targetGroup2 = new aws.lb.TargetGroup(
    targetGroupName,
    {
      port: ENV.webPort,
      protocol: 'HTTP',
      targetType: 'ip',
      vpcId: vpcId,
    },
    { protect },
  )

  createECSfargateService({
    packageType: 'web',
    image,
    port: ENV.webPort,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
    protect,
  })

  return { repoUrl }
}
