import { vpcId } from '../common/vpc'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'

const publicSubnetName = withPrefix('public-web-subnet')
const publicSubnet = new aws.ec2.Subnet(publicSubnetName, {
  vpcId: vpcId,
  cidrBlock: '10.0.2.0/24',
  mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
  tags: {
    name: 'main web public subnet',
  },
})

// const privateSubnetName = withPrefix('private-subnet');
// const privateSubnet = ...

export const subnets = [publicSubnet.arn]
