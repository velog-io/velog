import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'

export const ecsTaskExecutionRole = new aws.iam.Role(withPrefix('ecs-te-role'), {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'ecs-tasks.amazonaws.com',
  }),
})

new aws.iam.RolePolicy(withPrefix('task-execution-role-policy'), {
  role: ecsTaskExecutionRole.id,
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['ssm:Describe*', 'ssm:Get*', 'ssm:List*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: 'ecr:GetAuthorizationToken',
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: ['logs:*', 'ecr:*'],
        Resource: '*',
      },
    ],
  },
})
