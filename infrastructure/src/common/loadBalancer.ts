import { PackageType } from './../type.d'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { SecurityGroup } from '@pulumi/aws/ec2'
import { portMapper } from '../lib/portMapper'

type CreateLoadBalancerParameter = {
  vpcId: Promise<string>
  subnetIds: Promise<string[]>
  certificateArn: Promise<string>
  elbSecurityGroup: SecurityGroup
  defaultSecurityGroupId: Promise<string>
  packageType: PackageType
}

export const createLoadBalancer = ({
  subnetIds,
  elbSecurityGroup,
  defaultSecurityGroupId,
  vpcId,
  certificateArn,
  packageType,
}: CreateLoadBalancerParameter) => {
  const loadBalancerName = withPrefix(`${packageType}-lb`)
  const loadBalancer = new aws.lb.LoadBalancer(
    loadBalancerName,
    {
      loadBalancerType: 'application',
      securityGroups: [defaultSecurityGroupId, elbSecurityGroup.id],
      subnets: subnetIds,
      tags: {
        Name: loadBalancerName,
      },
    },
    {},
  )

  const port = portMapper[packageType]

  const targetGroupName = withPrefix(`${packageType}-tg`)
  const targetGroup = new aws.lb.TargetGroup(
    targetGroupName,
    {
      port,
      protocol: 'HTTP',
      targetType: 'ip',
      vpcId: vpcId,
    },
    {},
  )

  new aws.lb.Listener(
    withPrefix(`${packageType}-lb-https-listener`),
    {
      loadBalancerArn: loadBalancer.arn,
      protocol: 'HTTPS',
      port: 443,
      sslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
      certificateArn: certificateArn.then((arn) => arn),
      defaultActions: [
        {
          type: 'forward',
          targetGroupArn: targetGroup.arn,
        },
      ],
    },
    {},
  )

  new aws.lb.Listener(
    withPrefix(`${packageType}-lb-http-listener`),
    {
      loadBalancerArn: loadBalancer.arn,
      port: 80,
      defaultActions: [
        {
          type: 'redirect',
          redirect: {
            port: '443',
            protocol: 'HTTPS',
            statusCode: 'HTTP_301',
          },
        },
      ],
    },
    {},
  )

  return { targetGroup }
}
