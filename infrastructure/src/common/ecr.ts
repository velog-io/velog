import { PackageType } from './../type.d'
import * as AWS from '@aws-sdk/client-ecr'
import * as awsx from '@pulumi/awsx'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../env'
import { Output } from '@pulumi/pulumi'

const client = new AWS.ECR({ region: 'ap-northeast-2' })

export const createECRImage = (type: PackageType, repoUrl: Output<string> | string | null) => {
  const option = options[type]
  if (!repoUrl) {
    const repo = new awsx.ecr.Repository(
      withPrefix(option.ecrRepoName),
      {
        forceDelete: false,
      },
      { retainOnDelete: true },
    )
    repoUrl = repo.url
  }

  const image = new awsx.ecr.Image(withPrefix(option.imageName), {
    repositoryUrl: repoUrl,
    path: option.path,
    extraOptions: ['--platform', 'linux/amd64'],
  })

  return repoUrl
}

export const getECRRepositoryUrl = async (type: PackageType): Promise<string | null> => {
  const option = options[type]
  const repository = await client.describeRepositories({})
  const repositoryName = repository.repositories
    ?.map((repo) => repo.repositoryName)
    .find((v) => v?.includes(option.ecrRepoName))

  if (!repositoryName) {
    return null
  }

  const repo = await aws.ecr.getRepository({
    name: repositoryName,
    tags: {},
  })
  return repo.repositoryUrl
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
  cron: {
    ecrRepoName: ENV.ecrCronRepositoryName,
    imageName: 'cron-image',
    path: '../packages/velog-cron/',
  },
}
