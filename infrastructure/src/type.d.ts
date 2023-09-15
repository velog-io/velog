import { Output } from '@pulumi/pulumi'

export type PackageType = 'server' | 'cron'

export type CreateInfraParameter = {
  vpcId: Promise<string>
  subnetIds: Promise<string[]>
  certificateArn: Promise<string>
  defaultSecurityGroupId: Promise<string>
  imageUri: string | Output<string>
}
