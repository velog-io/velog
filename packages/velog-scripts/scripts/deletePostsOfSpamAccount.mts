import 'reflect-metadata'
import { Post, User, UserProfile } from '@prisma/client'
import { DbService } from '../lib/db/DbService.mjs'
import { container, injectable } from 'tsyringe'
import inquirer from 'inquirer'
import { ENV } from '../env/env.mjs'

interface IRunner {}

@injectable()
class Runner implements IRunner {
  constructor(private readonly db: DbService) {}
  public async run(names: string[]) {
    const handledUser: PrivatedUserInfo[] = []
    for (const name of names) {
      try {
        const user = await this.findUsersByUsername(name)
        const posts = await this.findWritenPostsByUserId(user.id)
        const askResult = await this.askDeletePosts(posts, name)

        if (!askResult.is_set_private) continue
        await this.setIsPrivatePost(askResult.posts.map(({ id }) => id!))

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
      orderBy: {
        created_at: 'desc',
      },
    })
    return posts
  }
  private async askDeletePosts(posts: Post[], displayName: string): Promise<AskDeletePostsResult> {
    console.log({
      displayName: displayName,
      '작성된 글': posts.map((post) => ({ title: post.title, body: post.body?.slice(0, 200) })),
    })

    const { answer } = await inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: '해당 유저의 모든 게시글을 비공개 설정하시겠습니까?',
        choices: ['no', 'yes'],
        default: 'no',
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
