import * as aws from '@pulumi/aws'
import { prefix } from '../lib/prefix'

export const elbSecurityGroup = new aws.ec2.SecurityGroup(`${prefix}-elb-sg`, {
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
})

export const taskSecurityGroup = new aws.ec2.SecurityGroup(`${prefix}-task-sg`, {
  description: 'Allow traffic from the load balancer',
  ingress: [
    {
      fromPort: 8080,
      toPort: 8080,
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
})
