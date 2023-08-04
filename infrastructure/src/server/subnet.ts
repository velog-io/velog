import * as aws from '@pulumi/aws'
import { vpc } from '../common/vpc'
import { prefix } from '../../lib/prefix'

export const privateSubnet1Name = `${prefix}-public-server-subnet-1`
new aws.ec2.Subnet(privateSubnet1Name, {
  vpcId: vpc.id,
  cidrBlock: '10.0.1.0/24',
  availabilityZoneId: 'apne2-az1',
  mapPublicIpOnLaunch: false, // subnet should be assigned a public IP address
  tags: {
    name: 'priavate-subnet-1',
  },
})

export const privateSubnet2Name = `${prefix}-public-server-subnet-2`
new aws.ec2.Subnet(privateSubnet2Name, {
  vpcId: vpc.id,
  cidrBlock: '10.0.1.0/24',
  availabilityZoneId: 'apne2-az2',
  mapPublicIpOnLaunch: false, // subnet should be assigned a public IP address
  tags: {
    name: 'priavate-subnet-2',
  },
})

// const privateSubnetName = `${prefix}-private-subnet`;
// const privateSubnet = ...
