import { FeedJob } from '@jobs/FeedJob.js'
import { PostJob } from '@jobs/PostJob.js'
import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'

const cronPlugin: FastifyPluginCallback = async (fastfiy, opts, done) => {
  const postJob = container.resolve(PostJob)
  const feedJob = container.resolve(FeedJob)

  const jobInfo: JobInfo[] = [
    {
      name: 'posts score calculation in every 5 minutes',
      cronTime: '*/5 * * * *', // every 5 minutes
      jobService: postJob,
      param: 0.5,
    },
    {
      name: 'posts score calculation in every day',
      cronTime: '0 6 * * *', // every day at 06:00 (6:00 AM)
      jobService: postJob,
      param: 0.1,
    },
    {
      name: 'generate feeds',
      cronTime: '*/1 * * * *', // every 1 minutes
      jobService: feedJob,
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

        if (isPostJob(info)) {
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

function isPostJob(arg: any): arg is PostJobInfo {
  return arg.jobService instanceof PostJob
}

function isFeedJob(arg: any): arg is FeedJobInfo {
  return arg.jobService instanceof FeedJob
}

type JobInfo = PostJobInfo | FeedJobInfo

type PostJobInfo = {
  name: string
  cronTime: string
  jobService: PostJob
  param: number
}

type FeedJobInfo = {
  name: string
  cronTime: string
  jobService: FeedJob
  param: undefined
}
