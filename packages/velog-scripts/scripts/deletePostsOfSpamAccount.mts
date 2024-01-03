import 'reflect-metadata'
import { Post, User } from '@prisma/client'
import { DbService } from '../lib/db/DbService.mjs'
import { container, injectable } from 'tsyringe'
import inquirer from 'inquirer'
import { ENV } from '../env/env.mjs'

interface IRunner {}

@injectable()
class Runner implements IRunner {
  constructor(private readonly db: DbService) {}
  private async findUsersByName(displayName: string): Promise<User> {
    const user = await this.db.user.findFirst({
      where: {
        profile: {
          display_name: displayName,
        },
      },
    })

    if (!user) {
      throw new Error(`Not found User, profile display_name: ${displayName}`)
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
    console.log('target PostId', postIds)
  }

  public async run(names: string[]) {
    for (const name of names) {
      const user = await this.findUsersByName(name)
      const posts = await this.findWritenPostsByUserId(user.id)
      const askResult = await this.askDeletePosts(posts, name)

      if (!askResult.is_set_private) continue

      await this.setIsPrivatePost(askResult.posts.map(({ id }) => id!))
    }
  }
}

type AskDeletePostsResult = { posts: Partial<Post>[]; is_set_private: boolean }
;(function excute() {
  const runner = container.resolve(Runner)
  runner.run(ENV.spamAccountDisplayName)
})()
