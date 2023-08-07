import * as aws from '@pulumi/aws'
import { vpcId } from './vpc'
import { internetGateway } from './internetGateway'
import { prefix } from '../../lib/prefix'

const routeTableName = `${prefix}-routeTable`
export const routeTable = new aws.ec2.RouteTable(routeTableName, {
  vpcId,
  routes: [
    {
      cidrBlock: '0.0.0.0/0',
      gatewayId: internetGateway.id,
    },
    {
      cidrBlock: '172.31.0.0/16', // local route table
    },
  ],
  tags: {
    Name: `${prefix}-routeTable`,
    name: `${prefix}-routeTable22123`,
  },
})
