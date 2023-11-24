import { CreateFeedJob } from '@jobs/CreateFeedJob.js'
import { CalculatePostScoreJob } from '@jobs/CalculatePostScoreJob.js'
import { GenerateTrendingWritersJob } from '@jobs/GenerateTrendingWritersJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { ENV } from '@env'

const cronPlugin: FastifyPluginCallback = async (fastfiy) => {
  const calculatePostScoreJob = container.resolve(CalculatePostScoreJob)
  const createFeedJob = container.resolve(CreateFeedJob)
  const generateTrendingWritersJob = container.resolve(GenerateTrendingWritersJob)

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
      name: 'generate trending writers',
      cronTime: '0 5 * * *', // every day at 05:00 (5:00 AM)
      jobService: generateTrendingWritersJob,
      param: undefined,
      isRunInDev: true,
    },
  ]

  const createJob = (description: JobDescription) => {
    const { name, cronTime } = description
    return fastfiy.cron.createJob({
      name,
      cronTime,
      onTick: async () => await createTick(description),
    })
  }

  if (ENV.appEnv === 'development') {
    const jobs = jobDescription.filter((job) => !!job.isRunInDev)
    await Promise.all(jobs.map(createTick))
  }

  if (ENV.dockerEnv === 'production') {
    const crons = jobDescription.map(createJob)
    await Promise.all(
      crons.map((cron) => {
        console.log(`${cron.name} is registered`)
        cron.start()
      }),
    )
  }
}

export default cronPlugin

function isNeedParamJobService(arg: any): arg is NeedParamJobService {
  return arg.jobService instanceof CalculatePostScoreJob
}

function isNotNeedParamJobService(arg: any): arg is NotNeedParamJobService {
  return (
    arg.jobService instanceof CreateFeedJob || arg.jobService instanceof GenerateTrendingWritersJob
  )
}

type JobDescription = NeedParamJobService | NotNeedParamJobService

type NeedParamJobService = {
  name: string
  cronTime: string
  jobService: CalculatePostScoreJob
  param: number
  isRunInDev?: boolean
}

type NotNeedParamJobService = {
  name: string
  cronTime: string
  jobService: CreateFeedJob | GenerateTrendingWritersJob
  param: undefined
  isRunInDev?: boolean
}

async function createTick(description: JobDescription) {
  const { jobService } = description
  if (jobService.isProgressing) return
  jobService.start()

  if (isNeedParamJobService(description)) {
    await description.jobService.runner(description.param)
  }

  if (isNotNeedParamJobService(description)) {
    await description.jobService.runner()
  }

  jobService.stop()
}
