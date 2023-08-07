import * as aws from '@pulumi/aws'
import { vpcId } from '../common/vpc'
import { prefix } from '../../lib/prefix'

export const publicServerSubnet1Name = `${prefix}-server-public-subnet-1`
new aws.ec2.Subnet(publicServerSubnet1Name, {
  vpcId,
  cidrBlock: '172.32.0.0/20',
  availabilityZoneId: 'apne2-az1',
  mapPublicIpOnLaunch: false, // subnet should be assigned a public IP address
  tags: {
    Name: 'public-subnet-1',
  },
})

export const publicServerSubnet2Name = `${prefix}-server-public-subnet-2`
new aws.ec2.Subnet(publicServerSubnet2Name, {
  vpcId,
  cidrBlock: '172.32.64.0/20',
  availabilityZoneId: 'apne2-az2',
  mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
  tags: {
    Name: 'public-subnet-2',
  },
})
