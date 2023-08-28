import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()

type Environment = 'development' | 'stage' | 'production'
const appEnv = config.require('APP_ENV') as Environment

// velog-development
// velog-production

const mapper: Record<Environment, string> = {
  development: 'dev',
  stage: 'stage',
  production: 'prod',
}

const prefix = `${config.name}-${mapper[appEnv]}`
export const withPrefix = (name: string) => `${prefix}-${name}`
