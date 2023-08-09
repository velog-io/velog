import * as aws from '@pulumi/aws'
import { prefix } from '../../lib/prefix'
import { elbSecurityGroup } from './securityGroup'
import { ENV } from '../../env'
import { serverSubnetIds } from './subnet'
import { vpcId } from '../common/vpc'

const lbName = `${prefix}-lb`
export const lb = new aws.lb.LoadBalancer(lbName, {
  securityGroups: [elbSecurityGroup.id],
  subnets: serverSubnetIds,
  loadBalancerType: 'application',
  tags: {
    Name: lbName,
  },
})

const targetGroupName = `${prefix}-targetgroup`
const targetGroup = new aws.alb.TargetGroup(targetGroupName, {
  vpcId: vpcId,
  port: ENV.port,
  protocol: 'HTTP',
  targetType: 'ip',
})

new aws.lb.Listener(`${prefix}-lb-https-listener`, {
  loadBalancerArn: lb.arn,
  protocol: 'HTTPS',
  port: 443,
  sslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
  certificateArn: ENV.sslCertificateArn,
  defaultActions: [
    {
      type: 'forward',
      targetGroupArn: targetGroup.arn,
    },
  ],
})

new aws.lb.Listener(`${prefix}-lb-http-listener`, {
  loadBalancerArn: lb.arn,
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
