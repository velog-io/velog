import { CreateInfraParameter, PackageType } from './type.d'
import { createWebInfra } from './packages/web'
import { createServerInfra } from './packages/server'
import { ENV } from './env'
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { createVPC } from './common/vpc'
import { getCertificate } from './common/certificate'
import { createCronInfra } from './packages/cron'
import { execCommand } from './lib/execCommand'
import { createECRImage, createECRRepository, getECRImage, getECRRepository } from './common/ecr'
import { getCluster } from './common/ecs'

execCommand('pnpm -r prisma:copy')

const config = new pulumi.Config()
const target = config.get('target')

if (!target) {
  throw new Error('Target not specified')
}

const targets = target.split(',').map((v) => v.trim())
const whiteList = ['all', 'web', 'server', 'cron']
const validate = targets.every((t) => whiteList.includes(t))

if (!validate) {
  throw new Error('Invalid target name, See the README.md')
}

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
const createInfraMapper: Record<PackageType, (func: CreateInfraParameter) => void> = {
  web: createWebInfra,
  server: createServerInfra,
  cron: createCronInfra,
}

export const imageUrls = getCluster().then((cluster) =>
  Object.entries(createInfraMapper).map(async ([pack, func]) => {
    let type = pack as PackageType
    let imageUri: pulumi.Output<string>
    if (targets.includes(type) || target === 'all') {
      const newRepo = createECRRepository(type)
      imageUri = createECRImage(type, newRepo)
    } else {
      const repo = await getECRRepository(type)
      imageUri = getECRImage(repo)
    }

    const infraSettings = {
      vpcId,
      subnetIds,
      certificateArn,
      defaultSecurityGroupId,
      imageUri,
      cluster,
    }

    func(infraSettings)

    return imageUri
  }),
)
