import { createServerSubnet } from '../packages/server/subnet'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'

// VPC
export const createVPC = () => {
  const vpcName = withPrefix('vpc')
  // const vpc = new aws.ec2.Vpc(vpcName, {
  //   cidrBlock: '172.32.0.0/16',
  //   instanceTenancy: 'default', // or dedicated
  //   tags: {
  //     Name: vpcName,
  //   },
  // })

  const vpc = aws.ec2.getVpc({ default: true })
  const subnets = aws.ec2.getSubnets()

  // // server subnet
  // const serverSubnet = vpc.id.apply((vpcId) => {
  //   return createServerSubnet(vpcId)
  // })

  // vpc.id.apply((vpcId) => {
  //   // DHCP
  //   const dhcpOptionName = withPrefix('dhcp-option')
  //   const dhcpOptionSet = new aws.ec2.VpcDhcpOptions(dhcpOptionName, {
  //     domainName: 'ap-northeast-2.compute.internal',
  //     domainNameServers: ['AmazonProvidedDNS'],
  //   })

  //   const dhcpName = withPrefix('dhcp')
  //   new aws.ec2.VpcDhcpOptionsAssociation(dhcpName, {
  //     vpcId,
  //     dhcpOptionsId: dhcpOptionSet.id,
  //   })

  //   const defaultNacl = vpc.id.apply((vpcId) =>
  //     aws.ec2.getNetworkAcls({
  //       vpcId: vpcId,
  //       filters: [
  //         {
  //           name: 'vpc-id',
  //           values: [vpcId],
  //         },
  //         {
  //           name: 'default',
  //           values: ['true'],
  //         },
  //       ],
  //     })
  //   )

  //   const naclResourceName = withPrefix('nacl-resource')
  //   const defaultNaclId = defaultNacl.apply((nacl) => nacl.ids[0])
  //   new aws.ec2.DefaultNetworkAcl(
  //     naclResourceName,
  //     {
  //       defaultNetworkAclId: defaultNaclId,
  //       egress: [
  //         {
  //           protocol: '-1',
  //           action: 'allow',
  //           ruleNo: 100,
  //           cidrBlock: '0.0.0.0/0',
  //           fromPort: 0,
  //           toPort: 0,
  //         },
  //       ],
  //       ingress: [
  //         {
  //           protocol: '-1',
  //           action: 'allow',
  //           ruleNo: 100,
  //           cidrBlock: '0.0.0.0/0',
  //           fromPort: 0,
  //           toPort: 0,
  //         },
  //       ],
  //       tags: {
  //         Name: withPrefix('nacl'),
  //       },
  //     },
  //     { dependsOn: vpc, id: defaultNaclId }
  //   )
  // })

  // const internetGatewayName = withPrefix('igw')
  // const internetGateway = new aws.ec2.InternetGateway(internetGatewayName, {
  //   vpcId: vpc.id.apply((id) => id),
  //   tags: {
  //     Name: internetGatewayName,
  //   },
  // })

  // const routeTableName = withPrefix('routeTable')
  // const routeTable = new aws.ec2.RouteTable(routeTableName, {
  //   vpcId: vpc.id.apply((id) => id),
  //   routes: [
  //     {
  //       cidrBlock: '0.0.0.0/0',
  //       gatewayId: internetGateway.id.apply((id) => id),
  //     },
  //   ],
  //   tags: {
  //     Name: routeTableName,
  //   },
  // })

  return { subnets, vpc }
}
