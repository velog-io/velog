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
import { createECRImage, createECRRepository, getECRImage, getECRRepository } from './common/ecr'
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

  let imageUrl: pulumi.Output<string> | string = ''
  if (target === type || target === 'all') {
    const newRepo = createECRRepository(type)
    imageUrl = createECRImage(type, newRepo)
  } else {
    const repo = await getECRRepository(type)
    const image = getECRImage(type, repo)
    image.apply((img) => {
      console.log('img', img)
      imageUrl = `${img.registryId}.dkr.ecr.ap-northeast-2.amazonaws.com/${img.repositoryName}:${img.imageTags[0]}`
    })
  }

  return imageUrl
  // const infraSettings = {
  //   vpcId,
  //   subnetIds,
  //   certificateArn,
  //   defaultSecurityGroupId,
  //   imageUri: img.imageUri,
  // }
  // func(infraSettings)
  // return infraSettings
})
