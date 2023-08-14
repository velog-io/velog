export type PackageType = 'web' | 'server'

export type CreateInfraParameter = {
  vpcId: Promise<string>
  subnetIds: Promise<string[]>
  certificateArn: Promise<string>
  defaultSecurityGroupId: Promise<string>
}
