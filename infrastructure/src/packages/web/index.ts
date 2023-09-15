import { ENV } from '../../env'
import { CreateInfraParameter } from '../../type'
import { createECSfargateService } from '../../common/ecs'
import { createLoadBalancer } from '../../common/loadBalancer'
import { createSecurityGroup } from '../../common/securityGroup'
import { withPrefix } from '../../lib/prefix'
import * as aws from '@pulumi/aws'

export const createWebInfra = ({
  vpcId,
  subnetIds,
  certificateArn,
  defaultSecurityGroupId,
  imageUri,
}: CreateInfraParameter) => {
  const { elbSecurityGroup, taskSecurityGroup } = createSecurityGroup({
    vpcId,
    packageType: 'web',
  })

  const { targetGroup } = createLoadBalancer({
    subnetIds,
    elbSecurityGroup,
    vpcId,
    certificateArn,
    packageType: 'web',
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
    {},
  )

  createECSfargateService({
    packageType: 'web',
    imageUri,
    port: ENV.webPort,
    subnetIds: subnetIds,
    targetGroup,
    defaultSecurityGroupId,
    taskSecurityGroup,
  })
}
