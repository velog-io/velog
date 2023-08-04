import { subnets } from './../web/subnet'
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { prefix } from '../../lib/prefix'
// import { privateSubnet1Name } from '../server/subnet'

export const vpcName = `${prefix}-vpc`
export const vpc = new aws.ec2.Vpc(vpcName, {
  cidrBlock: '172.32.0.0/16',
  instanceTenancy: 'default', // or dedicated
  tags: {
    Name: 'velog-vpc',
  },
})

const defaultVpc = vpc.id.apply((id) => {
  const v = aws.ec2.getVpc({
    default: false,
    filters: [{ name: 'tag:Name', values: ['velog-vpc'] }],
  })
  return v
})

const subnetIds = defaultVpc.apply((vpc) => {
  const subnets = aws.ec2.getSubnets({
    filters: [{ name: 'vpc-id', values: [vpc.id] }],
  })
  return subnets.then((subnets) => subnets.ids)
})

// DHCP
const dhcpOptionName = `${prefix}-dhcp-option`
export const dhcpOptionSet = new aws.ec2.VpcDhcpOptions(dhcpOptionName, {
  domainName: 'ap-northeast-2.compute.internal',
  domainNameServers: ['AmazonProvidedDNS'],
})

const dhcpName = `${prefix}-dhcp`
export const dhcpAssociate = new aws.ec2.VpcDhcpOptionsAssociation(dhcpName, {
  vpcId: vpc.id,
  dhcpOptionsId: dhcpOptionSet.id,
})

// NACL
const naclName = `${prefix}-nacl`
new aws.ec2.NetworkAcl(naclName, {
  vpcId: vpc.id,
  subnetIds,
  egress: [
    {
      protocol: '-1',
      action: 'allow',
      ruleNo: 100,
      cidrBlock: '0.0.0.0/0',
      fromPort: 0,
      toPort: 0,
    },
  ],
  ingress: [
    {
      protocol: '-1',
      action: 'allow',
      ruleNo: 100,
      cidrBlock: '0.0.0.0/0',
      fromPort: 0,
      toPort: 0,
    },
  ],
})
