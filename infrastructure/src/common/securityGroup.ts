import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../env'
import { PackageType } from '../type.d'
import { portMapper } from '../lib/portMapper'

type CreateSecurityGroupParameter = {
  vpcId: Promise<string>
  packageType: PackageType
}

export const createSecurityGroup = ({ vpcId, packageType }: CreateSecurityGroupParameter) => {
  const elbSecurityGroupName = withPrefix(`${packageType}-elb-sg`)
  const elbSecurityGroup = new aws.ec2.SecurityGroup(
    elbSecurityGroupName,
    {
      vpcId,
      description: 'Allow traffic from the internet',
      ingress: [
        {
          fromPort: 80,
          toPort: 80,
          protocol: 'tcp',
          cidrBlocks: ['0.0.0.0/0'],
        },
        {
          fromPort: 443,
          toPort: 443,
          protocol: 'tcp',
          cidrBlocks: ['0.0.0.0/0'],
        },
      ],
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: '-1',
          cidrBlocks: ['0.0.0.0/0'],
        },
      ],
      tags: {
        Name: elbSecurityGroupName,
      },
    },
    {},
  )

  const taskSecurityGroupName = withPrefix(`${packageType}-task-sg`)

  const port = portMapper[packageType]
  const taskSecurityGroup = new aws.ec2.SecurityGroup(
    taskSecurityGroupName,
    {
      vpcId,
      description: 'Allow traffic from the load balancer',
      ingress: [
        {
          fromPort: port,
          toPort: port,
          protocol: 'tcp',
          securityGroups: [elbSecurityGroup.id],
        },
      ],
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: '-1',
          cidrBlocks: ['0.0.0.0/0'],
        },
      ],
      tags: {
        Name: taskSecurityGroupName,
      },
    },
    {},
  )

  return { elbSecurityGroup, taskSecurityGroup }
}
