import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from '../JobProgress.mjs'
import { StatsService } from '@services/StatsService/index.mjs'

@singleton()
@injectable()
export class StatsWeekly extends JobProgress implements Job {
  constructor(private readonly statsService: StatsService) {
    super()
  }

  public async runner(): Promise<void> {
    console.log('StatsWeekly start...')
    await this.statsService.weekly()
  }
}
