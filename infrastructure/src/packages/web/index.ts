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

  // connecting for v2 client
  const targetGroupName = withPrefix('v2-tg')
  const targetGroup2 = new aws.lb.TargetGroup(
    targetGroupName,
    {
      port: ENV.webV2Port,
      protocol: 'HTTP',
      targetType: 'ip',
      vpcId: vpcId,
    },
    {},
  )

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
