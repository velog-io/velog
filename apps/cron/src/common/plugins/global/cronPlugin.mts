import fp from 'fastify-plugin'
import { StatsDaily, StatsWeekly, StatsMonthly } from '@jobs/stats/index.js'
import { GenerateFeedJob } from '@jobs/GenerateFeedJob.mjs'
import { CalculatePostScoreJob } from '@jobs/CalculatePostScoreJob.mjs'
import { GenerateTrendingWritersJob } from '@jobs/GenerateTrendingWritersJob.mjs'
import { DeleteFeedJob } from '@jobs/DeleteFeedJob.mjs'
import type { FastifyPluginAsync } from 'fastify'
import { container } from 'tsyringe'
import { ENV } from '@env'
import { CheckPostSpamJob } from '@jobs/CheckPostSpamJob.mjs'
import { DeletePostReadJob } from '@jobs/DeletePostReadJob.mjs'
import { ScorePostJob } from '@jobs/ScorePostJob.mjs'

const cronPlugin: FastifyPluginAsync = async (fastfiy) => {
  const calculatePostScoreJob = container.resolve(CalculatePostScoreJob)
  const generateFeedJob = container.resolve(GenerateFeedJob)
  const generateTrendingWritersJob = container.resolve(GenerateTrendingWritersJob)
  const deleteFeedJob = container.resolve(DeleteFeedJob)
  const statsDailyJob = container.resolve(StatsDaily)
  const statsWeeklyJob = container.resolve(StatsWeekly)
  const statsMonthlyJob = container.resolve(StatsMonthly)
  const checkPostSpamJob = container.resolve(CheckPostSpamJob)
  const deleteReadPostJob = container.resolve(DeletePostReadJob)
  const scorePostJob = container.resolve(ScorePostJob)

  // 덜 실행하면서, 실행되는 순서로 정렬
  // crontime은 UTC 기준으로 작성되기 때문에 KST에서 9시간을 빼줘야함
  const jobDescription: JobDescription[] = [
    {
      name: 'generate trending writers every day',
      cronTime: '0 5 * * *', // every day at 05:00 (5:00 AM)
      jobService: generateTrendingWritersJob,
    },
    {
      name: 'posts score calculation in every day',
      cronTime: '0 21 * * *', // every day at 06:00 (6:00 AM)
      jobService: calculatePostScoreJob,
      param: 0.1,
    },
    {
      name: 'delete feed in every hour',
      cronTime: '10 * * * *', // every hour at 10 minutes
      jobService: deleteFeedJob,
    },
    {
      name: 'generate feeds in every 1 minute',
      cronTime: '*/1 * * * *', // every 1 minute
      jobService: generateFeedJob,
    },
    {
      name: 'posts score calculation in every 5 minutes',
      cronTime: '*/5 * * * *', // every 5 minutes
      jobService: calculatePostScoreJob,
      param: 0.5,
    },
    {
      name: 'score post in every 1 minutes',
      cronTime: '*/1 * * * *', // every 1 minutes
      jobService: scorePostJob,
    },
    {
      name: 'check post spam in every 2 minutes',
      cronTime: '*/2 * * * *', // every 2 minutes
      jobService: checkPostSpamJob,
    },
    {
      name: 'delete post read in every 2 minutes',
      cronTime: '*/2 * * * *', // every 2 minutes
      jobService: deleteReadPostJob,
    },
    // Stats Start
    {
      name: 'providing a count of new users and posts from the past 1 day',
      cronTime: '0 0 * * *', // every day at 9:00 AM
      jobService: statsDailyJob,
    },
    {
      name: 'providing a count of new users and posts from the past 1 week',
      cronTime: '59 23 * * 0',
      jobService: statsWeeklyJob,
    },
    {
      name: 'providing a count of new users and posts from the past 1 month',
      cronTime: '0 0 1 * *', // every 1st day of month at 8:58 AM
      jobService: statsMonthlyJob,
    },
    // Stats end
  ]

  const createJob = (description: JobDescription) => {
    const { name, cronTime } = description
    return fastfiy.cron.createJob({
      name,
      cronTime,
      onTick: async () => await createTick(description),
    })
  }

  const initializeJobs = async () => {
    console.log('Initializing cron jobs...')
    if (ENV.appEnv !== 'production') {
      const immediateRunJobs = jobDescription.filter((job) => job.isImmediateExecute)
      const crons = await Promise.all(immediateRunJobs.map(createJob))
      for (const cron of crons) {
        cron.start()
        console.log(`${cron.name} is registered`)
      }
    }

    if (['production', 'stage'].includes(ENV.dockerEnv)) {
      const crons = await Promise.all(jobDescription.map(createJob))
      for (const cron of crons) {
        cron.start()
        console.log(`${cron.name} is registered`)
      }
    }
  }

  try {
    await initializeJobs()
  } catch (error) {
    console.error('Error initializing cron jobs:', error)
  }
}

function isNeedParamJobService(arg: any): arg is NeedParamJobService {
  return arg.jobService instanceof CalculatePostScoreJob
}

function isNotNeedParamJobService(arg: any): arg is NotNeedParamJobService {
  return arg.jobService instanceof CalculatePostScoreJob === false
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

type JobDescription = NeedParamJobService | NotNeedParamJobService

type JobService =
  | CalculatePostScoreJob
  | GenerateFeedJob
  | GenerateTrendingWritersJob
  | DeleteFeedJob
  | StatsDaily
  | StatsWeekly
  | StatsMonthly
  | CheckPostSpamJob
  | DeletePostReadJob
  | ScorePostJob

type BaseJobService = {
  name: string
  cronTime: string
  isImmediateExecute?: boolean
}

type NeedParamJobService = BaseJobService & {
  param: any
  jobService: CalculatePostScoreJob
}

type NotNeedParamJobService = Omit<BaseJobService, 'param'> & {
  jobService: Exclude<JobService, CalculatePostScoreJob>
}

export default fp(cronPlugin, {
  name: 'cronPlugin',
  fastify: '4.x',
  decorators: {
    fastify: ['cron'],
  },
})
