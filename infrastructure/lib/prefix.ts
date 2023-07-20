import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()
console.log('test')
const appEnv = config.require('APP_ENV')

export const prefix = `${config.name}-${appEnv}`
