import { subnets } from './../web/subnet'
import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as pulumi from '@pulumi/pulumi'
import { prefix } from '../../lib/prefix'

export const vpcName = `${prefix}-vpc`
export const vpc = new aws.ec2.Vpc(vpcName, {
  cidrBlock: '172.32.0.0/16',
  instanceTenancy: 'default', // or dedicated
  tags: {
    Name: 'velog-vpc',
  },
})

export const vpcId = vpc.id.apply((id) => id)
export const subnetIds = vpc.id.apply(async (id) => {
  const subnets = await aws.ec2.getSubnets({
    filters: [{ name: 'vpc-id', values: [id] }],
  })
  return subnets.ids
})

// DHCP
const dhcpOptionName = `${prefix}-dhcp-option`
export const dhcpOptionSet = new aws.ec2.VpcDhcpOptions(dhcpOptionName, {
  domainName: 'ap-northeast-2.compute.internal',
  domainNameServers: ['AmazonProvidedDNS'],
})

const dhcpName = `${prefix}-dhcp`
export const dhcpAssociate = new aws.ec2.VpcDhcpOptionsAssociation(dhcpName, {
  vpcId,
  dhcpOptionsId: dhcpOptionSet.id,
})

const defaultNacl = vpc.id.apply((vpcId) =>
  aws.ec2.getNetworkAcls({
    vpcId: vpcId,
    filters: [
      {
        name: 'vpc-id',
        values: [vpcId],
      },
      {
        name: 'default',
        values: ['true'],
      },
    ],
  })
)

const naclResourceName = `${prefix}-nacl-resource`
const defaultNaclId = defaultNacl.apply((nacl) => nacl.ids[0])
new aws.ec2.DefaultNetworkAcl(
  naclResourceName,
  {
    defaultNetworkAclId: defaultNaclId,
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
    tags: {
      Name: `${prefix}-nacl`,
    },
  },
  { dependsOn: vpc, id: defaultNaclId }
)
