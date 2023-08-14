import { Input } from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../../env'
import { SecurityGroup } from '@pulumi/aws/ec2'

export const createLoadBalancer = (
  subnetIds: Input<Input<string>[]>,
  elbSecurityGroup: SecurityGroup,
  vpcId: Input<string>,
  certificateArn: Promise<string>,
  type: 'web' | 'server'
) => {
  const loadBalancerName = withPrefix(`${type}-lb`)
  const loadBalancer = new aws.lb.LoadBalancer(loadBalancerName, {
    loadBalancerType: 'application',
    securityGroups: [elbSecurityGroup.id],
    subnets: subnetIds,
    tags: {
      Name: loadBalancerName,
    },
  })

  const portMapper = {
    web: ENV.webPort,
    server: ENV.serverPort,
  }
  const port = portMapper[type]

  const targetGroupName = withPrefix(`${type}-tg`)
  const targetGroup = new aws.lb.TargetGroup(targetGroupName, {
    port,
    protocol: 'HTTP',
    targetType: 'ip',
    vpcId: vpcId,
  })

  new aws.lb.Listener(withPrefix(`${type}-lb-https-listener`), {
    loadBalancerArn: loadBalancer.arn,
    protocol: 'HTTPS',
    port: 443,
    sslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
    // sslPolicy: 'ELBSecurityPolicy-2016-08',
    certificateArn: certificateArn.then((arn) => arn),
    defaultActions: [
      {
        type: 'forward',
        targetGroupArn: targetGroup.arn,
      },
    ],
  })

  new aws.lb.Listener(withPrefix(`${type}-lb-http-listener`), {
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
  })

  return { targetGroup }
}
