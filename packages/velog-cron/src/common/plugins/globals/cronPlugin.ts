import { CreateFeedJob } from '@jobs/CreateFeedJob.js'
import { CalculatePostScoreJob } from '@jobs/CalculatePostScoreJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { RecommendFollowerJob } from '@jobs/RecommendFollowerJob.js'
import { ENV } from '@env'

const cronPlugin: FastifyPluginCallback = async (fastfiy, opts, done) => {
  const calculatePostScoreJob = container.resolve(CalculatePostScoreJob)
  const createFeedJob = container.resolve(CreateFeedJob)
  const recommendFollowerJob = container.resolve(RecommendFollowerJob)

  const jobDescription: JobDescription[] = [
    {
      name: 'posts score calculation in every 5 minutes',
      cronTime: '*/5 * * * *', // every 5 minutes
      jobService: calculatePostScoreJob,
      param: 0.5,
    },
    {
      name: 'posts score calculation in every day',
      cronTime: '0 6 * * *', // every day at 06:00 (6:00 AM)
      jobService: calculatePostScoreJob,
      param: 0.1,
    },
    {
      name: 'generate feeds',
      cronTime: '*/1 * * * *', // every 1 minutes
      jobService: createFeedJob,
      param: undefined,
    },
    {
      name: 'generate recommend followers',
      cronTime: '0 5 * * *', // every day at 05:00 (5:00 AM)
      jobService: recommendFollowerJob,
      param: undefined,
    },
  ]

  const createJob = (description: JobDescription) => {
    const { name, cronTime, jobService } = description
    return fastfiy.cron.createJob({
      name,
      cronTime,
      onTick: async () => {
        if (jobService.isProgressing) return
        jobService.start()

        if (isNeedParamJobService(description)) {
          await description.jobService.runner(description.param)
        }

        if (isNotNeedParamJobService(description)) {
          await description.jobService.runner()
        }

        jobService.stop()
      },
    })
  }

  if (ENV.dockerEnv === 'production') {
    const crons = jobDescription.map(createJob)
    await Promise.all(crons.map((cron) => cron.start()))
  }

  done()
}

export default cronPlugin

function isNeedParamJobService(arg: any): arg is NeedParamJobService {
  return arg.jobService instanceof CalculatePostScoreJob
}

function isNotNeedParamJobService(arg: any): arg is NotNeedParamJobService {
  return arg.jobService instanceof CreateFeedJob || arg.jobService instanceof RecommendFollowerJob
}

type JobDescription = NeedParamJobService | NotNeedParamJobService

type NeedParamJobService = {
  name: string
  cronTime: string
  jobService: CalculatePostScoreJob
  param: number
  isOnlyStage?: boolean
}

type NotNeedParamJobService = {
  name: string
  cronTime: string
  jobService: CreateFeedJob | RecommendFollowerJob
  param: undefined
  isOnlyStage?: boolean
}
