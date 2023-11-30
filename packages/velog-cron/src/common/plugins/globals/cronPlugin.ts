import { GenerateFeedJob } from '@jobs/GenerateFeedJob.js'
import { CalculatePostScoreJob } from '@jobs/CalculatePostScoreJob.js'
import { GenerateTrendingWritersJob } from '@jobs/GenerateTrendingWritersJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { ENV } from '@env'

const cronPlugin: FastifyPluginCallback = async (fastfiy, opts, done) => {
  const calculatePostScoreJob = container.resolve(CalculatePostScoreJob)
  const generateFeedJob = container.resolve(GenerateFeedJob)
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
      name: 'generate feeds in every 1 minute',
      cronTime: '*/1 * * * *', // every 1 minute
      jobService: generateFeedJob,
      param: undefined,
    },
    {
      name: 'generate trending writers every day',
      cronTime: '0 5 * * *', // every day at 05:00 (5:00 AM)
      jobService: generateTrendingWritersJob,
      param: undefined,
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

  // for test
  if (ENV.dockerEnv !== 'production') {
    const immediateRunJobs = jobDescription.filter((job) => !!job.isImmediate)
    await Promise.all(immediateRunJobs.map(createTick))
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

  done()
}

export default cronPlugin

function isNeedParamJobService(arg: any): arg is NeedParamJobService {
  return arg.jobService instanceof CalculatePostScoreJob
}

function isNotNeedParamJobService(arg: any): arg is NotNeedParamJobService {
  return (
    arg.jobService instanceof GenerateFeedJob ||
    arg.jobService instanceof GenerateTrendingWritersJob
  )
}

type JobDescription = NeedParamJobService | NotNeedParamJobService

type NeedParamJobService = {
  name: string
  cronTime: string
  jobService: CalculatePostScoreJob
  param: number
  isImmediate?: boolean
}

type NotNeedParamJobService = {
  name: string
  cronTime: string
  jobService: GenerateFeedJob | GenerateTrendingWritersJob
  param: undefined
  isImmediate?: boolean
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
