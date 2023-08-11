import * as awsx from '@pulumi/awsx'

import { withPrefix } from '../lib/prefix'
import { ENV } from '../../env'

export const getECRImage = (type: 'web' | 'server') => {
  const option = options[type]
  const repo = new awsx.ecr.Repository(option.ecrRepoName, { forceDelete: true })
  const image = new awsx.ecr.Image(withPrefix(option.imageName), {
    repositoryUrl: repo.url,
    path: option.path,
    extraOptions: ['--platform', 'linux/amd64'],
  })

  const repoUrl = repo.url

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
