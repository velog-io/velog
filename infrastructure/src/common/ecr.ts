import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'

import { withPrefix } from '../lib/prefix'
import { ENV } from '../../env'
import path from 'path'

export const getECRImage = (type: 'web' | 'server') => {
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

  const option = options[type]
  const repo = new awsx.ecr.Repository(ENV.ecrServerRepositoryName)

  const image = new awsx.ecr.Image(withPrefix(option.imageName), {
    repositoryUrl: repo.url,
    path: path.resolve(process.cwd(), option.path),
  })
  const repoUrl = repo.url
  return { image, repoUrl }
}
