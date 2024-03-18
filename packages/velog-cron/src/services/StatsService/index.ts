import { DbService } from '@lib/db/DbService.js'
import { DiscordService } from '@lib/discord/DiscordService.js'
import { injectable, singleton } from 'tsyringe'
import {
  endOfDay,
  startOfDay,
  subDays,
  format,
  startOfWeek,
  subWeeks,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns'

interface Service {
  daily(): Promise<void>
  weekly(): Promise<void>
  monthly(): Promise<void>
}

@injectable()
@singleton()
export class StatsService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly discord: DiscordService,
  ) {}
  public async daily(): Promise<void> {
    const start = startOfDay(subDays(new Date(), 1))
    const end = endOfDay(subDays(new Date(), 1))

    const usersCount = await this.getUsersCount(start, end)
    const postCount = await this.getPostsCount(start, end)

    await this.discord.sendMessage(
      'stats',
      `[Daily]\n기간: ${format(
        start,
        'yyyy-MM-dd',
      )}}\n${usersCount}명의 사용자가 가입했습니다.\n${postCount}개의 공개 포스트가 작성되었습니다.`,
    )
  }
  public async weekly() {
    const start = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }) // 월요일부터 시작
    const end = endOfWeek(subWeeks(new Date(), 1))

    const usersCount = await this.getUsersCount(start, end)
    const postCount = await this.getPostsCount(start, end)

    await this.discord.sendMessage(
      'stats',
      `[Weekly]\n기간: ${format(
        start,
        'yyyy-MM-dd',
      )}\n${usersCount}명의 사용자가 가입했습니다.\n${postCount}개의 공개 포스트가 작성되었습니다.`,
    )
  }
  public async monthly() {
    const start = startOfMonth(subMonths(new Date(), 1))
    const end = endOfMonth(subMonths(new Date(), 1))

    const usersCount = await this.getUsersCount(start, end)
    const postCount = await this.getPostsCount(start, end)

    const timeFormat = 'yyyy-MM-dd'
    await this.discord.sendMessage(
      'stats',
      `[Monthly]\n기간: ${format(start, timeFormat)} ~ ${format(
        end,
        timeFormat,
      )}\n${usersCount}명의 사용자가 가입했습니다.\n${postCount}개의 공개 포스트가 작성되었습니다.`,
    )
  }
  private async getUsersCount(start: Date, end: Date) {
    return await this.db.user.count({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
    })
  }
  private async getPostsCount(start: Date, end: Date) {
    return await this.db.post.count({
      where: {
        is_temp: false,
        is_private: false,
        created_at: {
          gte: start,
          lte: end,
        },
      },
    })
  }
}
