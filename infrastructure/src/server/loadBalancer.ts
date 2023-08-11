import { Input } from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../../env'
import { SecurityGroup } from '@pulumi/aws/ec2'

export const createServerLoadBalancer = (
  serverSubnetIds: Input<Input<string>[]>,
  serverElbSecurityGroup: SecurityGroup,
  vpcId: Input<string>,
  certificateArn: Promise<string>
) => {
  const loadBalancerName = withPrefix('server-lb')
  const serverLoadBalancer = new aws.lb.LoadBalancer(loadBalancerName, {
    loadBalancerType: 'application',
    securityGroups: [serverElbSecurityGroup.id],
    subnets: serverSubnetIds,
    tags: {
      Name: loadBalancerName,
    },
  })

  const targetGroupName = withPrefix('server-tg')
  const serverTargetGroup = new aws.lb.TargetGroup(targetGroupName, {
    port: ENV.serverPort,
    protocol: 'HTTP',
    targetType: 'ip',
    vpcId: vpcId,
  })

  new aws.lb.Listener(withPrefix('server-lb-https-listener'), {
    loadBalancerArn: serverLoadBalancer.arn,
    protocol: 'HTTPS',
    port: 443,
    // sslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
    sslPolicy: 'ELBSecurityPolicy-2016-08',
    certificateArn: certificateArn.then((arn) => arn),
    defaultActions: [
      {
        type: 'forward',
        targetGroupArn: serverTargetGroup.arn,
      },
    ],
  })

  new aws.lb.Listener(withPrefix('server-lb-http-listener'), {
    loadBalancerArn: serverLoadBalancer.arn,
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
  })

  return { serverTargetGroup }
}
