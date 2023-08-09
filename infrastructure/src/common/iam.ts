import * as aws from '@pulumi/aws'
import { withPrefix } from '../../lib/prefix'

export const ecsTaskExecutionRole = new aws.iam.Role(withPrefix('ecs-te-role'), {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'ecs-tasks.amazonaws.com',
  }),
})

// add iam policy
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

// attach policy
new aws.iam.RolePolicyAttachment(withPrefix('ecs-task-execution-role-policy-attachment'), {
  role: ecsTaskExecutionRole,
  policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
})
