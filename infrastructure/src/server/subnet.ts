import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { Input } from '@pulumi/pulumi'

export const createServerSubnet = (vpcId: Input<string>) => {
  console.log('voc', vpcId)
  const publicServerSubnet1Name = withPrefix('server-public-subnet-1')
  const subnet1 = new aws.ec2.Subnet(publicServerSubnet1Name, {
    vpcId,
    cidrBlock: '172.32.0.0/20',
    availabilityZoneId: 'apne2-az1',
    mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
    tags: {
      Name: publicServerSubnet1Name,
      Type: 'server',
    },
  })

  const publicServerSubnet2Name = withPrefix('server-public-subnet-2')
  const subnet2 = new aws.ec2.Subnet(publicServerSubnet2Name, {
    vpcId,
    cidrBlock: '172.32.64.0/20',
    availabilityZoneId: 'apne2-az2',
    mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
    tags: {
      Name: publicServerSubnet2Name,
      Type: 'server',
    },
  })

  return [subnet1, subnet2]
}
