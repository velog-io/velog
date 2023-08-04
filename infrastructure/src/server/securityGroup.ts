// import * as aws from '@pulumi/aws'
// import { prefix } from '../../lib/prefix'
// import { ENV } from '../../env'

// export const elbSecurityGroup = new aws.ec2.SecurityGroup(`${prefix}-elb-sg`, {
//   description: 'Allow traffic from the internet',
//   ingress: [
//     {
//       fromPort: 80,
//       toPort: 80,
//       protocol: 'tcp',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//     {
//       fromPort: 443,
//       toPort: 443,
//       protocol: 'tcp',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//   ],
//   egress: [
//     {
//       fromPort: 0,
//       toPort: 0,
//       protocol: '-1',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//   ],
// })

// export const taskSecurityGroup = new aws.ec2.SecurityGroup(`${prefix}-task-sg`, {
//   description: 'Allow traffic from the load balancer',
//   ingress: [
//     {
//       fromPort: ENV.port,
//       toPort: ENV.port,
//       protocol: 'tcp',
//       securityGroups: [elbSecurityGroup.id],
//     },
//   ],
//   egress: [
//     {
//       fromPort: 0,
//       toPort: 0,
//       protocol: '-1',
//       cidrBlocks: ['0.0.0.0/0'],
//     },
//   ],
// })
