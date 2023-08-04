import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()

const appEnv = config.require('APP_ENV')

// velog-development
// velog-production
export const prefix = `${config.name}-${appEnv}`
