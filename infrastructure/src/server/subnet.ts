import * as aws from '@pulumi/aws'
import { publicServerSubnet1Name, publicServerSubnet2Name, vpcId } from '../common/vpc'

new aws.ec2.Subnet(publicServerSubnet1Name, {
  vpcId,
  cidrBlock: '172.32.0.0/20',
  availabilityZoneId: 'apne2-az1',
  mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
  tags: {
    Name: publicServerSubnet1Name,
  },
})

new aws.ec2.Subnet(publicServerSubnet2Name, {
  vpcId,
  cidrBlock: '172.32.64.0/20',
  availabilityZoneId: 'apne2-az2',
  mapPublicIpOnLaunch: true, // subnet should be assigned a public IP address
  tags: {
    Name: publicServerSubnet2Name,
  },
})
