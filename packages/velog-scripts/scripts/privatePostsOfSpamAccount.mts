import 'reflect-metadata'
import { Post, User, UserProfile } from '@prisma/client'
import { DbService } from '../lib/db/DbService.mjs'
import { container, injectable } from 'tsyringe'
import inquirer from 'inquirer'
import { ENV } from '../env/env.mjs'
import { DiscordService } from '../lib/discord/DiscordService.mjs'
import { RedisService } from '../lib/redis/RedisService.mjs'

interface IRunner {}

@injectable()
class Runner implements IRunner {
  blackList!: string[]
  constructor(
    private readonly db: DbService,
    private readonly discord: DiscordService,
    private readonly redis: RedisService,
  ) {}
  public async run(names: string[]) {
    await this.init()

    const handledUser: PrivatedUserInfo[] = []
    for (const username of names) {
      try {
        const user = await this.findUsersByUsername(username)
        const posts = await this.findWritenPostsByUserId(user.id)

        if (posts.length === 0) {
          console.log(`${user.username} 유저의 비공개 처리 할 게시글이 없습니다.`)
          continue
        }

        const askResult = await this.askDeletePosts(
          posts,
          user.id,
          username,
          user.profile?.display_name || null,
        )

        if (!askResult.is_set_private) continue
        await this.setIsPrivatePost(askResult.posts.map(({ id }) => id!))
        await this.redis.addBlackList(username)

        const privatedUesrInfo: PrivatedUserInfo = {
          id: user.id,
          username: user.username,
          displayName: user.profile?.display_name || null,
          email: user.email,
        }

        handledUser.push(privatedUesrInfo)
      } catch (error) {
        console.log(error)
      }
    }

    if (handledUser.length === 0) {
      console.log('게시글 비공개 처리된 유저가 존재하지 않습니다.')
      process.exit(0)
    }

    try {
      const result = await this.discord.sendMessage(
        ENV.discordPrivatePostsChannelId,
        JSON.stringify({
          title: '해당 유저의 글들이 비공개 처리 되었습니다.',
          userInfo: handledUser,
        }),
      )

      console.log(result)
      process.exit(0)
    } catch (error) {
      console.log(error)
    }
  }
  private async init() {
    try {
      await this.discord.connection()
      await this.redis.connection()

      this.blackList = await this.redis.readBlackList()
    } catch (error) {
      throw error
    }
  }
  private async findUsersByUsername(
    username: string,
  ): Promise<User & { profile: UserProfile | null }> {
    const user = await this.db.user.findFirst({
      where: {
        username,
      },
      include: {
        profile: true,
      },
    })

    if (!user || !user.profile) {
      throw new Error(`Not found User, username: ${username}`)
    }

    return user
  }
  private async findWritenPostsByUserId(userId: string) {
    const posts = await this.db.post.findMany({
      where: {
        user: {
          id: userId,
        },
        is_private: false,
      },
      take: 5,
      orderBy: {
        created_at: 'desc',
      },
    })
    return posts
  }
  private async askDeletePosts(
    posts: Post[],
    userId: string,
    username: string,
    displayName: string | null,
  ): Promise<AskDeletePostsResult> {
    if (this.blackList.includes(username)) {
      return {
        posts,
        is_set_private: true,
      }
    }

    console.log({
      id: userId,
      username: username,
      displayName: displayName ?? '',
      '작성된 글': posts.map((post) => ({
        title: post.title,
        body: post.body?.trim().slice(0, 150),
      })),
    })

    const { answer } = await inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: `${username} 유저의 모든 게시글을 비공개 설정하고, 영구적으로 blackList에 등록하시겠습니까?`,
        choices: ['yes', 'no'],
        default: 'yes',
      },
    ])

    if (!['yes', 'no'].includes(answer)) {
      throw new Error('Wrong Answer')
    }

    return { posts, is_set_private: answer === 'yes' }
  }

  private async setIsPrivatePost(postIds: string[]) {
    await this.db.post.updateMany({
      where: {
        id: {
          in: postIds,
        },
      },
      data: {
        is_private: true,
      },
    })
  }
}

type AskDeletePostsResult = { posts: Partial<Post>[]; is_set_private: boolean }
type PrivatedUserInfo = {
  id: string
  username: string
  displayName: string | null
  email: string | null
}
;(function excute() {
  const runner = container.resolve(Runner)
  runner.run(ENV.spamAccountDisplayName)
})()
