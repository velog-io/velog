import 'reflect-metadata'
import { Comment, Post, User, UserProfile } from '@packages/database/velog-rds'
import { DbService } from '../lib/db/DbService.mjs'
import { container, injectable } from 'tsyringe'

import { DiscordService } from '../lib/discord/DiscordService.mjs'
import { BlockListService } from '../lib/blockList/BlockListService.mjs'
import { format } from 'date-fns'
// import inquirer from 'inquirer'

const ENV = {
  discordPrivatePostsChannelId: process.env.DISCORD_PRIVATE_POSTS_CHANNEL_ID,
  spamAccountDisplayName: process.env.SPAM_ACCOUNT_DISPLAY_NAME?.split(',') || [],
}

if (!ENV.discordPrivatePostsChannelId) {
  throw new Error('Missing Discord private posts channel ID.') // Provide an error message
}

interface IRunner {}

@injectable()
class Runner implements IRunner {
  constructor(
    private readonly db: DbService,
    private readonly discord: DiscordService,
    private readonly blockList: BlockListService,
  ) {}
  public async run(names: string[]) {
    await this.init()

    const handledUser: BlockUserInfo[] = []
    for (const username of names) {
      try {
        const user = await this.findUsersByUsername(username)
        const posts = await this.findWritenPostsByUserId(user.id)
        const comments = await this.findWritenCommentByUserId(user.id)

        const blockList = await this.blockList.readBlockList()

        // add block list
        if (blockList.includes(username)) {
          console.log(`${username} 유저는 이미 등록되어 있습니다.`)
        } else {
          await this.blockList.addBlockList(username)
          console.log(`${username} 유저가 blockList에 등록되었습니다.`)
        }

        if (posts.length === 0) {
          console.log(`${user.username} 유저의 비공개 처리 할 게시글이 없습니다.`)
          // continue
        }

        const askResult = await this.askUpdatePrivatePosts(
          posts,
          comments,
          user.id,
          username,
          user.profile?.display_name || null,
          user.created_at,
        )

        if (!askResult.is_set_private) {
          console.log('비공개 처리를 거부하셨습니다.')
          continue
        }

        const postIds = posts.map(({ id }) => id!)
        const commentIds = comments.map(({ id }) => id!)

        // set private = true
        await this.setIsPrivatePost(postIds)
        // set deleted = true
        await this.setDeletedComment(commentIds)

        const blockUesrInfo: BlockUserInfo = {
          id: user.id,
          username: user.username,
          displayName: user.profile?.display_name || null,
          email: user.email,
          postIds,
        }

        handledUser.push(blockUesrInfo)
      } catch (error) {
        console.log(error)
      }
    }

    if (handledUser.length === 0) {
      console.log('비공개 게시글로 처리된 유저가 존재하지 않습니다.')
      process.exit(0)
    }

    try {
      const promises = handledUser.map(async (userInfo) => {
        await this.discord.sendMessage(
          ENV.discordPrivatePostsChannelId!,
          JSON.stringify({
            title: '해당 유저의 글과 댓글들이 비공개 처리 되었습니다.',
            userInfo: userInfo,
          }),
        )
      })

      await Promise.all(promises)
      process.exit(0)
    } catch (error) {
      console.log(error)
    }
  }
  private async init() {
    try {
      await this.discord.connection()
      await this.db.$connect()
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
  private async findWritenCommentByUserId(userId: string) {
    const comments = await this.db.comment.findMany({
      where: {
        fk_user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    })
    return comments
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
  private async askUpdatePrivatePosts(
    posts: Post[],
    comments: Comment[],
    userId: string,
    username: string,
    displayName: string | null,
    createdAt: Date,
  ): Promise<AskDeletePostsResult> {
    console.log({
      id: userId,
      username: username,
      displayName: displayName ?? '',
      '가입 날짜': format(createdAt, 'yyyy-MM-dd'),
      '업데이트 될 글 개수': posts.length,
      '최근 작성된 글': posts.slice(0, 5).map((post) => ({
        title: post.title,
        body: post.body?.trim().slice(0, 150),
      })),
      '최근 작성된 댓글': comments.slice(0, 5).map((comment) => ({
        body: comment.text?.trim().slice(0, 150),
      })),
    })

    // const { answer } = await inquirer.prompt([
    //   {
    //     type: 'list',
    //     name: 'answer',
    //     message: `${username} 유저의 모든 게시글을 비공개 설정하고, 영구적으로 blockList에 등록하시겠습니까?`,
    //     choices: ['yes', 'no'],
    //     default: 'yes',
    //   },
    // ])

    // if (!['yes', 'no'].includes(answer)) {
    //   throw new Error('Wrong Answer')
    // }

    return { posts, is_set_private: true }
  }
  private async setIsPrivatePost(postIds: string[]) {
    return await this.db.post.updateMany({
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
  private async setDeletedComment(commentIds: string[]) {
    return await this.db.comment.updateMany({
      where: {
        id: {
          in: commentIds,
        },
      },
      data: {
        deleted: true,
      },
    })
  }
}

type AskDeletePostsResult = { posts: Partial<Post>[]; is_set_private: boolean }
type BlockUserInfo = {
  id: string
  username: string
  displayName: string | null
  email: string | null
  postIds: string[]
}
;(function excute() {
  const runner = container.resolve(Runner)
  runner.run(ENV.spamAccountDisplayName)
})()
