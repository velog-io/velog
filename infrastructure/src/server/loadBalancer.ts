import * as aws from '@pulumi/aws'
import { withPrefix } from '../../lib/prefix'
import { serverElbSecurityGroup } from './securityGroup'
import { ENV } from '../../env'
import { serverSubnetIds } from './subnet'
import { vpcId } from '../common/vpc'

const loadBalancerName = withPrefix('lb')
export const serverLoadBalancer = new aws.lb.LoadBalancer(loadBalancerName, {
  securityGroups: [serverElbSecurityGroup.id],
  subnets: serverSubnetIds,
  loadBalancerType: 'application',
  tags: {
    Name: loadBalancerName,
  },
})

const targetGroupName = withPrefix('target-group')
export const serverTargetGroup = new aws.alb.TargetGroup(targetGroupName, {
  vpcId: vpcId,
  port: ENV.serverPort,
  protocol: 'HTTP',
  targetType: 'ip',
})

new aws.lb.Listener(withPrefix('lb-https-listener'), {
  loadBalancerArn: serverLoadBalancer.arn,
  protocol: 'HTTPS',
  port: 443,
  sslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
  certificateArn: ENV.sslCertificateArn,
  defaultActions: [
    {
      type: 'forward',
      targetGroupArn: serverTargetGroup.arn,
    },
  ],
})

new aws.lb.Listener(withPrefix('lb-http-listener'), {
  loadBalancerArn: serverLoadBalancer.arn,
  protocol: 'HTTP',
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
