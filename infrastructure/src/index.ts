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
import { createECRImage, getECRImageURI } from './common/ecr'

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

export const imageUris = Object.entries(createInfraMapper).map(async ([type, func]) => {
  let imageUri = null

  if (type === target || target === 'all') {
    imageUri = createECRImage({ type: type as PackageType })
  } else {
    imageUri = await getECRImageURI({ type: type as PackageType })
  }

  if (!imageUri) {
    throw new Error('Not allow nullable image uri')
  }

  const infraSettings = {
    vpcId,
    subnetIds,
    certificateArn,
    defaultSecurityGroupId,
    imageUri: '',
  }

  if (typeof imageUri !== 'string') {
    imageUri.apply((uri) => {
      Object.assign(infraSettings, { imageUri: uri })
      console.log(infraSettings)
      func(infraSettings)
    })
  } else {
    Object.assign(infraSettings, { imageUri })
    console.log(infraSettings)
    func(infraSettings)
  }

  return imageUri
})
