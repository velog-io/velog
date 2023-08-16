import * as awsx from '@pulumi/awsx'

import { withPrefix } from '../lib/prefix'
import { ENV } from '../../env'
import { execCommand } from '../lib/execCommand'

export const getECRImage = (type: 'web' | 'server') => {
  execCommand('pnpm -r prisma:copy')

  const option = options[type]
  const repo = new awsx.ecr.Repository(option.ecrRepoName, { forceDelete: true })
  const image = new awsx.ecr.Image(withPrefix(option.imageName), {
    repositoryUrl: repo.url,
    path: option.path,
    extraOptions: ['--platform', 'linux/amd64'],
  })

  const repoUrl = repo.url

  execCommand('pnpm -r prisma:rm')

  return { image, repoUrl }
}

const options = {
  web: {
    ecrRepoName: ENV.ecrWebRepositoryName,
    imageName: 'web-image',
    path: '../packages/velog-web/',
  },
  server: {
    ecrRepoName: ENV.ecrServerRepositoryName,
    imageName: 'server-image',
    path: '../packages/velog-server/',
  },
}
