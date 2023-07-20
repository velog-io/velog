import * as aws from '@pulumi/aws'
import { prefix } from '../lib/prefix'

export const ecsTaskExecutionRole = new aws.iam.Role(`${prefix}-te-role`, {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
    Service: 'ecs-tasks.amazonaws.com',
  }),
})

// add iam policy
new aws.iam.RolePolicy(`${prefix}-task-execution-role-policy`, {
  role: ecsTaskExecutionRole.id,
  // allow access to ssm parameter
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
    ],
  },
})

// attach policy
new aws.iam.RolePolicyAttachment(`${prefix}-ecs-task-execution-role-policy-attachment`, {
  role: ecsTaskExecutionRole,
  policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
})
