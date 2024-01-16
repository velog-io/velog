import 'reflect-metadata'
import { getMockUserWithProfile, MockUserWithProfileType } from 'test/mock/mockUser'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Post, Prisma, User } from '@prisma/client'
import { mockComment } from 'test/mock/mockComment'
import { MockPostsType, mockPosts } from 'test/mock/mockPost'
import { v4 as uuidv4 } from 'uuid'
import { ENV } from '@env'
import {
  CommentNotificationAction,
  FollowerNotificationAction,
  NotificationAction,
  PostLikeNotificationAction,
} from '@graphql/helpers/generated'

const MAX_COMMENTS_PER_POST = 5

class Seeder {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public createUser(mockUser: MockUserWithProfileType[]) {
    return mockUser.map((user) => {
      const { profile, ...rest } = user
      return this.db.user.create({
        data: {
          ...rest,
          profile: {
            create: {
              ...profile,
            },
          },
          velogConfig: {
            create: {},
          },
          userMeta: {
            create: {},
          },
        },
      })
    })
  }
  public createPost(users: User[], posts: MockPostsType[]) {
    return users
      .map((user) => posts.map((post) => ({ ...post, fk_user_id: user.id })))
      .flat()
      .map((mockPost, i) => {
        return this.db.post.create({
          data: {
            ...mockPost,
            url_slug: `${mockPost.url_slug}${i * 11}`,
            released_at: this.utils.now,
          },
        })
      })
  }
  public createComment(
    posts: Post[],
    comments: Prisma.CommentUncheckedCreateInput[],
    users: User[],
  ) {
    return posts
      .map((post) =>
        this.utils
          .shuffle<Prisma.CommentUncheckedCreateInput>(comments)
          .slice(0, MAX_COMMENTS_PER_POST)
          .map((comment) => ({ ...comment, fk_post_id: post.id })),
      )
      .flat()
      .map((comment) => {
        const user = this.utils.shuffle(users)[0]
        return this.db.comment.create({
          data: {
            ...comment,
            fk_user_id: user.id,
          },
        })
      })
  }
  public async createNotification(users: User[]) {
    return users.map(async (u) => {
      const user = await this.db.user.findUnique({
        where: {
          id: u.id,
        },
        select: {
          profile: true,
        },
      })

      if (!user) {
        throw new Error('Not found User')
      }

      const actionDataUser = await this.db.user.findFirst({
        where: {
          id: {
            not: u.id,
          },
        },
        include: {
          profile: true,
        },
      })

      if (!actionDataUser) {
        throw new Error('Not found Action Data User')
      }

      const post = await this.db.post.findFirst({
        where: {
          fk_user_id: actionDataUser.id,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      })

      if (!post) return null

      const postLikeActionId = [uuidv4(), uuidv4(), uuidv4()]
      const commentActionId = [...postLikeActionId]
      const followerActionId = [uuidv4(), uuidv4(), uuidv4()]

      const postLikeAction: () => PostLikeNotificationAction & { type: string } = () => ({
        fk_post_id: postLikeActionId[this.utils.randomNumber(3)] ?? uuidv4(),
        display_name: actionDataUser?.profile?.display_name || '',
        title: 'Test post',
        url_slug: post.url_slug || '',
        fk_user_id: actionDataUser.id,
        writer_username: post.user.username,
        type: 'postLike',
      })

      const commentAction: () => CommentNotificationAction & { type: string } = () => ({
        fk_post_id: commentActionId[this.utils.randomNumber(3)] ?? uuidv4(),
        fk_user_id: 'uuid',
        text: '안녕하세요. Velog 좋아요.',
        url_slug: post.url_slug || '',
        title: post.title || 'Post Title',
        writer_username: post.user.username,
        type: 'comment',
      })

      const followerAction: () => FollowerNotificationAction & { type: string } = () => ({
        fk_user_id: followerActionId[this.utils.randomNumber(3)] ?? uuidv4(),
        display_name: actionDataUser.profile?.display_name || '',
        type: 'follower',
      })

      const actionSelector: (() => NotificationAction & { type: string })[] = [
        commentAction,
        postLikeAction,
        followerAction,
      ]

      const notificationMocks = Array(500)
        .fill(0)
        .map(() => actionSelector[this.utils.randomNumber(2)]())

      const promises = notificationMocks.map((action: any) => {
        return this.db.notification.create({
          data: {
            fk_user_id: u.id,
            action_id: action?.fk_post_id || action?.fk_user_id,
            action,
            type: action.type,
          },
        })
      })

      await Promise.all(promises)
    })
  }
}

async function main() {
  try {
    const db = new DbService()
    const utils = new UtilsService()
    const seeder = new Seeder(db, utils)

    const mockUserWithProfile = getMockUserWithProfile(10)
    const createUsers = seeder.createUser(mockUserWithProfile)
    const users = await Promise.all(createUsers)

    const createPosts = seeder.createPost(users, mockPosts)
    const posts = await Promise.all(createPosts)

    const createComments = seeder.createComment(posts, mockComment, users)
    await Promise.all(createComments)

    const createnotifications = await seeder.createNotification(users)
    await Promise.all(createnotifications)
  } catch (error) {}
}

function checkAppEnv() {
  if (ENV.appEnv !== 'development') {
    throw Error('Only Allow development environment')
  }
}

function checkDatabaseUrl() {
  if (!ENV.databaseUrl.includes('localhost') && !ENV.databaseUrl.includes('stage')) {
    throw new Error('Database host must be localhost')
  }
}

checkAppEnv()
checkDatabaseUrl()
main()
