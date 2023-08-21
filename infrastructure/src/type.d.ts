export type PackageType = 'web' | 'server' | 'cron'

export type CreateInfraParameter = {
  vpcId: Promise<string>
  subnetIds: Promise<string[]>
  defaultSecurityGroupId: Promise<string>
}
