import { CreateInfraParameter, PackageType } from './type.d'
// import { createWebInfra } from './packages/web'
import { createServerInfra } from './packages/server'
import { ENV } from './env'
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { createVPC } from './common/vpc'
import { getCertificate } from './common/certificate'
import { createCronInfra } from './packages/cron'
import { execCommand } from './lib/execCommand'
import { imageHandler, createECRRepository, getECRRepository } from './common/ecr'
import { Image } from '@pulumi/awsx/ecr/image'

execCommand('pnpm -r prisma:copy')

const config = new pulumi.Config()
const target = config.get('target') as PackageType | 'all'

const validTargets = ['all', 'web', 'server', 'cron']
if (!target || !validTargets.includes(target)) {
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
  // web: createWebInfra,
  server: createServerInfra,
  cron: createCronInfra,
}

export const imageUrls = Object.entries(createInfraMapper).map(async ([pack, func]) => {
  let type = pack as PackageType

  let image: pulumi.Output<Image> | null = null
  if (target === type || target === 'all') {
    const newRepo = createECRRepository(type)
    image = imageHandler(type, newRepo)
  } else {
    const repo = await getECRRepository(type)
    // TODO: 이미지를 새로 안만들거나, 원래 있던 imageUrl 경로를 불러오는 방법이 빠르겠다.
    image = imageHandler(type, repo)
  }

  return image.apply((img) => {
    const infraSettings = {
      vpcId,
      subnetIds,
      certificateArn,
      defaultSecurityGroupId,
      imageUri: img.imageUri,
    }

    // func(infraSettings)

    return infraSettings
  })
})
