import { PackageType } from './../type.d'
import * as AWS from '@aws-sdk/client-ecr'
import * as awsx from '@pulumi/awsx'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../env'
import { Repository } from '@pulumi/aws/ecr'
import { Image } from '@pulumi/awsx/ecr'
import { customAlphabet } from 'nanoid'
import { Output } from '@pulumi/pulumi'
const nanoid = customAlphabet('1234567890abcdefghijk', 10)

const client = new AWS.ECR({ region: 'ap-northeast-2' })

export const createECRRepository = (type: PackageType): Repository => {
  const option = options[type]
  const repo = new aws.ecr.Repository(withPrefix(option.ecrRepoName), {
    forceDelete: true,
  })
  return repo
}

export const getECRRepository = async (type: PackageType): Promise<Repository> => {
  const option = options[type]
  const repository = await client.describeRepositories({})
  const repo = repository.repositories
    ?.map((repo) => ({
      repositoryName: repo.repositoryName,
      repositoryId: repo.registryId,
      repoUri: `${repo.registryId}.dkr.ecr.ap-northeast-2.amazonaws.com/${repo.repositoryName}`,
    }))
    .find(
      (v) => v.repositoryName?.includes('velog') && v.repositoryName?.includes(option.ecrRepoName),
    )

  if (!repo) {
    throw new Error('Not found repository')
  }

  return new aws.ecr.Repository(
    withPrefix(option.ecrRepoName),
    { forceDelete: true },
    { import: repo.repositoryName },
  )
}

export const imageHandler = (type: PackageType, repo: Repository): Output<Image> => {
  const option = options[type]
  return repo.registryId.apply((arn) => {
    console.log('arn', arn)
    const image = new awsx.ecr.Image(
      withPrefix(option.imageName),
      {
        repositoryUrl: repo.repositoryUrl,
        path: option.path,
        extraOptions: ['--platform', 'linux/amd64'],
      },
      {
        replaceOnChanges: ['repositoryUrl'],
      },
    )
    return image
  })
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
