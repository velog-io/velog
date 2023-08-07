import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { prefix } from '../../lib/prefix'
import { ENV } from '../../env'
import { vpc, vpcId } from '../common/vpc'

const elbSecurityGroupName = `${prefix}-elb-sg`
export const elbSecurityGroup = new aws.ec2.SecurityGroup(elbSecurityGroupName, {
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

const taskSecurityGroupName = `${prefix}-task-sg`
export const taskSecurityGroup = new aws.ec2.SecurityGroup(taskSecurityGroupName, {
  description: 'Allow traffic from the load balancer',
  vpcId: vpcId.apply((id) => id),
  ingress: [
    {
      fromPort: ENV.port,
      toPort: ENV.port,
      protocol: 'tcp',
      securityGroups: [elbSecurityGroup.id],
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
