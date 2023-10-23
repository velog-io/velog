import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()

type Environment = 'development' | 'stage' | 'production'
const dockerEnv = config.require('DOCKER_ENV') as Environment

// velog-development
// velog-production

const mapper: Record<Environment, string> = {
  development: 'dev',
  stage: 'stage',
  production: 'prod',
}

const prefix = `${config.name}-${mapper[dockerEnv]}`
export const withPrefix = (word: string) => `${prefix}-${word}`
