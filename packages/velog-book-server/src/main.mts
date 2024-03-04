import 'reflect-metadata'

import { EnvService } from '@lib/env/EnvService.mjs'
import { container } from 'tsyringe'

const env = container.resolve(EnvService)
env.init()
