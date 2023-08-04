import * as aws from '@pulumi/aws'
import { vpc } from '../common/vpc'
import { prefix } from '../../lib/prefix'

export const privateSubnet1Name = `${prefix}-server-private-subnet-1`
new aws.ec2.Subnet(privateSubnet1Name, {
  vpcId: vpc.id,
  cidrBlock: '172.32.0.0/18',
  availabilityZoneId: 'apne2-az1',
  mapPublicIpOnLaunch: false, // subnet should be assigned a public IP address
  tags: {
    Name: 'private-subnet-1',
  },
})

export const privateSubnet2Name = `${prefix}-server-private-subnet-2`
new aws.ec2.Subnet(privateSubnet2Name, {
  vpcId: vpc.id,
  cidrBlock: '172.32.64.0/18',
  availabilityZoneId: 'apne2-az2',
  mapPublicIpOnLaunch: false, // subnet should be assigned a public IP address
  tags: {
    Name: 'private-subnet-2',
  },
})

// // const privateSubnetName = `${prefix}-private-subnet`;
// // const privateSubnet = ...
