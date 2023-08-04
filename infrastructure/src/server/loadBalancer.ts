// import * as aws from '@pulumi/aws'
// import * as awsx from '@pulumi/awsx'
// import { prefix } from '../../lib/prefix'
// import { elbSecurityGroup } from './securityGroup'
// import { ENV } from '../../env'
// import { serverSubnetIds } from './subnet'

// export const lb = new awsx.lb.ApplicationLoadBalancer(`${prefix}-lb`, {
//   securityGroups: [elbSecurityGroup.id],
//   subnetIds: serverSubnetIds,
//   defaultTargetGroup: {
//     port: ENV.port,
//     protocol: 'HTTP',
//     targetType: 'ip',
//   },
// })

// new aws.lb.Listener(`${prefix}-https-listener`, {
//   loadBalancerArn: lb.loadBalancer.arn,
//   protocol: 'HTTPS',
//   port: 443,
//   certificateArn: ENV.sslCertificateArn,
//   sslPolicy: 'ELBSecurityPolicy-TLS13-1-2-2021-06',
//   defaultActions: [
//     {
//       type: 'forward',
//       targetGroupArn: lb.defaultTargetGroup.arn,
//     },
//   ],
// })

// new aws.lb.Listener(`${prefix}-http-listener`, {
//   loadBalancerArn: lb.loadBalancer.arn,
//   port: 80,
//   defaultActions: [
//     {
//       type: 'redirect',
//       redirect: {
//         port: '443',
//         protocol: 'HTTPS',
//         statusCode: 'HTTP_301',
//       },
//     },
//   ],
// })
