import pulumi, { Output } from '@pulumi/pulumi'
import { SecurityGroup } from '@pulumi/aws/ec2'
import { TargetGroup } from '@pulumi/aws/alb'
import { Cluster } from '@pulumi/aws/ecs'

export type PackageType = 'web' | 'server' | 'cron'

export type CreateInfraParameter = {
  vpcId: Promise<string>
  subnetIds: Promise<string[]>
  certificateArn: Promise<string>
  defaultSecurityGroupId: Promise<string>
  imageUri: string | Output<string>
  cluster: Cluster
}

export type CreateECSFargateParams = {
  subnetIds: pulumi.Input<pulumi.Input<string>[]>
  taskSecurityGroup: SecurityGroup
  defaultSecurityGroupId: Promise<string>
  targetGroup: TargetGroup
  port: number
  packageType: PackageType
  environment?: { name: string; value: string }[]
  imageUri: pulumi.Output<string> | string
  cluster: Cluster
}
