import { CreateInfraParameter } from './type.d'
import { createWebInfra } from './packages/web'
import { createServerInfra } from './packages/server'
import { ENV } from './env'
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { createVPC } from './common/vpc'
import { getCertificate } from './common/certificate'
import { createCronInfra } from './packages/cron'
import { execCommand } from './lib/execCommand'

const config = new pulumi.Config()
const target = config.get('target')

type Target = 'server' | 'cron'

const validTargets = ['all', 'web', 'server', 'cron']
if (!target || !validTargets.includes(target)) {
  throw new Error('Invalid target name, See the README.md')
}

execCommand('pnpm -r prisma:copy')

// VPC, Subnet, DHCP, Intergate way, route Table
const { subnets, vpc } = createVPC()
export const vpcId = vpc.then((v) => v.id)
export const subnetIds = subnets.then((subnets) => subnets.ids)

// Security Group
const defaultSecurityGroup = vpcId.then((id) =>
  aws.ec2.getSecurityGroup({
    vpcId: id,
    name: 'default',
  }),
)
export const defaultSecurityGroupId = defaultSecurityGroup.then((sg) => sg.id)

const certificateArn = getCertificate(ENV.certificateDomain)

const createInfraMapper: Record<
  Target,
  (func: CreateInfraParameter) => {
    repoUrl: pulumi.Output<string>
  }
> = {
  // web: createWebInfra,
  server: createServerInfra,
  cron: createCronInfra,
}

export const repourls = Object.entries(createInfraMapper).map(([key, func]) => {
  const infraSettings = {
    vpcId,
    subnetIds,
    certificateArn,
    defaultSecurityGroupId,
    protect: true,
  }

  if (target === key || target === 'all') {
    Object.assign(infraSettings, { protect: false })
  }

  const { repoUrl } = func(infraSettings)
  return repoUrl
})
