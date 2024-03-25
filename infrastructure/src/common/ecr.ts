import { PackageType } from './../type.d'
import * as clientEcr from '@aws-sdk/client-ecr'
import * as aws from '@pulumi/aws'
import { withPrefix } from '../lib/prefix'
import { ENV } from '../env'
import { Repository } from '@pulumi/aws/ecr'
import * as pulumi from '@pulumi/pulumi'
import * as docker from '@pulumi/docker'

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
    .find((v) => v.repositoryName?.includes(`velog-${ENV.dockerEnv}-${option.ecrRepoName}`))

  if (!existsRepo) {
    console.info('Not found repository, so create new Repository')
    const repo = new aws.ecr.Repository(withPrefix(option.ecrRepoName), { forceDelete: true })
    createRepoLifecyclePolicy(type, repo)
    return repo
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
  const image = new docker.Image(
    withPrefix(option.imageName),
    {
      imageName: pulumi.interpolate`${repo.repositoryUrl}:latest`,
      build: {
        context: option.context,
        dockerfile: `${option.dockerfile}/Dockerfile`,
        platform: 'linux/amd64',
        args: {
          DOCKER_ENV: `${ENV.dockerEnv}`,
          AWS_ACCESS_KEY_ID: `${ENV.awsAccessKeyId}`,
          AWS_SECRET_ACCESS_KEY: `${ENV.awsSecretAccessKey}`,
          BUILDKIT_INLINE_CACHE: '1',
        },
        cacheFrom: {
          images: [pulumi.interpolate`${repo.repositoryUrl}:latest`],
        },
      },
    },
    {
      retainOnDelete: true,
    },
  )

  return image.imageName
}

export const getECRImage = (repo: Repository): pulumi.Output<string> => {
  const image = aws.ecr.getImageOutput({
    repositoryName: repo.name,
    mostRecent: true,
  })

  if (!image) {
    throw new Error(`Not found ${repo} Image`)
  }

  return image.apply(() => {
    return pulumi.interpolate`${repo.repositoryUrl}:latest`
  })
}

const options = {
  web: {
    ecrRepoName: ENV.ecrWebRepositoryName,
    imageName: 'web-image',
    dockerfile: '../packages/velog-web',
    context: '../',
  },
  server: {
    ecrRepoName: ENV.ecrServerRepositoryName,
    imageName: 'server-image',
    dockerfile: '../packages/velog-server',
    context: '../',
  },
  cron: {
    ecrRepoName: ENV.ecrCronRepositoryName,
    imageName: 'cron-image',
    dockerfile: '../packages/velog-cron',
    context: '../',
  },
}
