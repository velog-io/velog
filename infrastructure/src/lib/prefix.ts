import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()

const appEnv = config.require('APP_ENV')

// velog-development
// velog-production
const prefix = `${config.name}-${appEnv}`
export const withPrefix = (name: string) => `${prefix}-${name}`
