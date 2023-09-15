import * as AWS from '@aws-sdk/client-ecr'
import * as awsx from '@pulumi/awsx'
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../env'
import { PackageType } from '../type'

type ECRPrameter = {
  type: PackageType
}

export const createECRImage = ({ type }: ECRPrameter) => {
  const option = options[type]
  const repo = new awsx.ecr.Repository(withPrefix(option.ecrRepoName), { forceDelete: true }, {})
  const image = new awsx.ecr.Image(
    withPrefix(option.imageName),
    {
      repositoryUrl: repo.url,
      path: option.path,
      extraOptions: ['--platform', 'linux/amd64'],
    },
    {},
  )

  const repoUrl = repo.url

  return { imageUri: image.imageUri, repoUrl }
}

export const getECRImageURI = async ({ type }: ECRPrameter) => {
  const client = new AWS.ECR({ region: 'ap-northeast-2' })
  const option = options[type]
  const repository = await client.describeRepositories({})
  const repositoryName = repository.repositories
    ?.map((f) => f.repositoryName)
    .find((v) => v?.includes(option.ecrRepoName))

  if (!repositoryName) {
    throw new Error('Not found repository name')
  }

  const repo = await aws.ecr.getRepository({ name: repositoryName })

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
