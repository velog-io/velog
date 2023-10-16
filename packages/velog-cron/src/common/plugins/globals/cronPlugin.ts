import { CreateFeedJob } from '@jobs/CreateFeedJob.js'
import { CalcPostScoreJob } from '@jobs/CalcPostScoreJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import { RecommendFollowerJob } from '@jobs/RecommendFollowerJob.js'

const cronPlugin: FastifyPluginCallback = async (fastfiy, opts, done) => {
  const calcPostScoreJob = container.resolve(CalcPostScoreJob)
  const createFeedJob = container.resolve(CreateFeedJob)
  const recommendFollowerJob = container.resolve(RecommendFollowerJob)

  const jobInfo: JobInfo[] = [
    {
      name: 'posts score calculation in every 5 minutes',
      cronTime: '*/5 * * * *', // every 5 minutes
      jobService: calcPostScoreJob,
      param: 0.5,
    },
    {
      name: 'posts score calculation in every day',
      cronTime: '0 6 * * *', // every day at 06:00 (6:00 AM)
      jobService: calcPostScoreJob,
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
      // cronTime: '0 5 * * *', // every day at 06:00 (5:00 AM)
      cronTime: '*/1 * * * *', // every 1 minutes
      jobService: recommendFollowerJob,
      param: undefined,
    },
  ]

  const createJob = (info: JobInfo) => {
    const { name, cronTime, jobService } = info
    return fastfiy.cron.createJob({
      name,
      cronTime,
      onTick: async () => {
        if (jobService.isProgressing) return
        jobService.start()

        if (isNeedParams(info)) {
          await info.jobService.runner(info.param)
        }
        if (isFeedJob(info)) {
          await info.jobService.runner()
        }

        jobService.stop()
      },
    })
  }

  const crons = jobInfo.map(createJob)
  await Promise.all(crons.map((cron) => cron.start()))

  done()
}

export default cronPlugin

function isNeedParams(arg: any): arg is NeedParamJobInfo {
  return arg.jobService instanceof CalcPostScoreJob
}

function isFeedJob(arg: any): arg is NotNeedParamJobInfo {
  return arg.jobService instanceof CreateFeedJob || arg.jobService instanceof RecommendFollowerJob
}

type JobInfo = NeedParamJobInfo | NotNeedParamJobInfo

type NeedParamJobInfo = {
  name: string
  cronTime: string
  jobService: CalcPostScoreJob
  param: number
}

type NotNeedParamJobInfo = {
  name: string
  cronTime: string
  jobService: CreateFeedJob | RecommendFollowerJob
  param: undefined
}
