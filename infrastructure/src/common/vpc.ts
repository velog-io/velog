import * as aws from '@pulumi/aws'
import { withPrefix } from '../../lib/prefix'

export const vpcName = withPrefix('vpc')
export const vpc = new aws.ec2.Vpc(vpcName, {
  cidrBlock: '172.32.0.0/16',
  instanceTenancy: 'default', // or dedicated
  tags: {
    Name: vpcName,
  },
})

export const publicServerSubnet1Name = withPrefix('server-public-subnet-1')
export const publicServerSubnet2Name = withPrefix('server-public-subnet-2')

export const vpcId = vpc.id.apply((id) => id)

// DHCP
const dhcpOptionName = withPrefix('dhcp-option')
export const dhcpOptionSet = new aws.ec2.VpcDhcpOptions(dhcpOptionName, {
  domainName: 'ap-northeast-2.compute.internal',
  domainNameServers: ['AmazonProvidedDNS'],
})

const dhcpName = withPrefix('dhcp')
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

const naclResourceName = withPrefix('nacl-resource')
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
      Name: withPrefix('nacl'),
    },
  },
  { dependsOn: vpc, id: defaultNaclId }
)
