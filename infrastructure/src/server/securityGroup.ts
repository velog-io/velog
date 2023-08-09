import * as aws from '@pulumi/aws'
import { withPrefix } from '../../lib/prefix'
import { ENV } from '../../env'
import { vpcId } from '../common/vpc'

const elbSecurityGroupName = withPrefix('elb-sg')
export const serverElbSecurityGroup = new aws.ec2.SecurityGroup(elbSecurityGroupName, {
  vpcId,
  description: 'Allow traffic from the internet',
  ingress: [
    {
      fromPort: 80,
      toPort: 80,
      protocol: 'tcp',
      cidrBlocks: ['0.0.0.0/0'],
    },
    {
      fromPort: 443,
      toPort: 443,
      protocol: 'tcp',
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: '-1',
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
  tags: {
    Name: elbSecurityGroupName,
  },
})

const taskSecurityGroupName = withPrefix('task-sg')
export const serverTaskSecurityGroup = new aws.ec2.SecurityGroup(taskSecurityGroupName, {
  description: 'Allow traffic from the load balancer',
  vpcId: vpcId,
  ingress: [
    {
      fromPort: ENV.serverPort,
      toPort: ENV.serverPort,
      protocol: 'tcp',
      securityGroups: [serverElbSecurityGroup.id],
    },
  ],
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: '-1',
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
  tags: {
    Name: taskSecurityGroupName,
  },
})
