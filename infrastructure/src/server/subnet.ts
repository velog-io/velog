import * as aws from '@pulumi/aws'
import { publicServerSubnet1Name, publicServerSubnet2Name, vpcId } from '../common/vpc'

export const subnet1 = new aws.ec2.Subnet(publicServerSubnet1Name, {
  vpcId,
  cidrBlock: '172.32.0.0/20',
  availabilityZoneId: 'apne2-az1',
  mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
  tags: {
    Name: publicServerSubnet1Name,
  },
})

export const subnet2 = new aws.ec2.Subnet(publicServerSubnet2Name, {
  vpcId,
  cidrBlock: '172.32.64.0/20',
  availabilityZoneId: 'apne2-az2',
  mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
  tags: {
    Name: publicServerSubnet2Name,
  },
})

export const serverSubnetIds = [subnet1.id, subnet2.id]
export const serverSubnet = [subnet1, subnet2]
