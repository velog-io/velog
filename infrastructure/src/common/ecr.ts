import { PackageType } from './../type.d'
import * as clientEcr from '@aws-sdk/client-ecr'
import * as awsx from '@pulumi/awsx'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../env'
import { Repository } from '@pulumi/aws/ecr'
import * as pulumi from '@pulumi/pulumi'

const ecrClient = new clientEcr.ECR({ region: 'ap-northeast-2' })

export const createECRRepository = (type: PackageType): Repository => {
  const option = options[type]
  const repo = new aws.ecr.Repository(withPrefix(option.ecrRepoName), {
    forceDelete: true,
  })
  createRepoLifecyclePolicy(type, repo)
  return repo
}

export const getECRRepository = async (type: PackageType): Promise<Repository> => {
  const option = options[type]
  const repository = await ecrClient.describeRepositories({})
  const existsRepo = repository.repositories
    ?.map((repo) => ({
      repositoryName: repo.repositoryName,
      repositoryId: repo.registryId,
      repoUri: `${repo.registryId}.dkr.ecr.ap-northeast-2.amazonaws.com/${repo.repositoryName}`,
    }))
    .find(
      (v) => v.repositoryName?.includes('velog') && v.repositoryName?.includes(option.ecrRepoName),
    )

  if (!existsRepo) {
    throw new Error('Not found repository')
  }

  const repo = new aws.ecr.Repository(
    withPrefix(option.ecrRepoName),
    { forceDelete: true },
    { import: existsRepo.repositoryName },
  )

  createRepoLifecyclePolicy(type, repo)
  return repo
}

const createRepoLifecyclePolicy = (type: PackageType, repo: Repository) => {
  const option = options[type]
  const maxImageCount = 2
  new aws.ecr.LifecyclePolicy(`${withPrefix(option.ecrRepoName)}-policy`, {
    repository: repo.name,
    policy: JSON.stringify({
      rules: [
        {
          rulePriority: 1,
          description: 'Keep only the last 2 images',
          selection: {
            tagStatus: 'any',
            countType: 'imageCountMoreThan',
            countNumber: maxImageCount,
          },
          action: {
            type: 'expire',
          },
        },
      ],
    }),
  })
}

export const createECRImage = (type: PackageType, repo: Repository): pulumi.Output<string> => {
  const option = options[type]
  const image = new awsx.ecr.Image(
    withPrefix(option.imageName),
    {
      repositoryUrl: repo.repositoryUrl,
      path: option.path,
      extraOptions: ['--platform', 'linux/amd64'],
    },
    {
      retainOnDelete: true,
    },
  )
  return image.imageUri
}

export const getECRImage = (repo: Repository): pulumi.Output<string> => {
  const image = aws.ecr.getImageOutput({
    repositoryName: repo.name,
    mostRecent: true,
  })
  return image.apply((img) => {
    const tag = img.imageTags.filter((str) => str !== 'latest')[0]
    const imageUri = `${img.registryId}.dkr.ecr.ap-northeast-2.amazonaws.com/${img.repositoryName}:${tag}`
    return imageUri
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
