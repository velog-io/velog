import { certificateArn } from './../common/certificate'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { serverElbSecurityGroup } from './securityGroup'
import { ENV } from '../../env'
import { serverSubnet, vpcId } from '../common/vpc'

const serverSubnetIds = serverSubnet.apply((subnet) => subnet.map((s) => s.id))
const loadBalancerName = withPrefix('server-lb')
export const serverLoadBalancer = new aws.lb.LoadBalancer(loadBalancerName, {
  securityGroups: [serverElbSecurityGroup.id],
  subnets: serverSubnetIds,
  loadBalancerType: 'application',
  tags: {
    Name: loadBalancerName,
  },
})

const targetGroupName = withPrefix('server-tg')
export const serverTargetGroup = new aws.lb.TargetGroup(targetGroupName, {
  vpcId: vpcId,
  port: ENV.serverPort,
  protocol: 'HTTP',
  targetType: 'ip',
})

new aws.lb.Listener(withPrefix('server-lb-https-listener'), {
  loadBalancerArn: serverLoadBalancer.arn,
  protocol: 'HTTPS',
  port: 443,
  sslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
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
