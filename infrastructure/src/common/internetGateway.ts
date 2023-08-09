import { vpcId } from './vpc'
import { withPrefix } from './../../lib/prefix'
import * as aws from '@pulumi/aws'

const internetGatewayName = withPrefix('igw')
export const internetGateway = new aws.ec2.InternetGateway(internetGatewayName, {
  vpcId,
  tags: {
    Name: internetGatewayName,
  },
})
