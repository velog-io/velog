import 'reflect-metadata'
import { faker } from '@faker-js/faker'
import { getMockUserWithProfile, MockUserWithProfileType } from 'test/mock/mockUser'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Post, Prisma, User } from '@packages/database/src/velog-rds.mjs'
import { mockComment } from 'test/mock/mockComment'
import { MockPostsType, mockPosts } from 'test/mock/mockPost'
import { v4 as uuidv4 } from 'uuid'
import { ENV } from '@env'
import {
  CommentNotificationActionInput,
  CommentReplyNotifictionActionInput,
  FollowNotificationActionInput,
  PostLikeNotificationActionInput,
} from '@graphql/helpers/generated'

const MAX_COMMENTS_PER_POST = 5

class Seeder {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public createUser(mockUser: MockUserWithProfileType[]) {
    return mockUser.map((user) => {
      const { profile, username, email, is_certified } = user
      return this.db.user.create({
        data: {
          username,
          email,
          is_certified,
          profile: {
            create: {
              display_name: profile.display_name,
              short_bio: profile.short_bio,
              thumbnail: profile.thumbnail,
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

      const actors = await this.db.user.findMany({
        where: {
          id: {
            not: u.id,
          },
        },
        include: {
          profile: true,
        },
        take: 1000,
      })

      const posts = await this.db.post.findMany({
        where: {
          fk_user_id: u.id,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      })

      const postIds = posts.map((post) => post.id)
      const followerActionId = [uuidv4(), uuidv4(), uuidv4()]

      for (let i = 0; i < actors.length; i++) {
        try {
          const actor = actors[i]

          const followerAction: () => FollowNotificationActionInput = () => ({
            follow_id: followerActionId[this.utils.randomNumber(2)] ?? uuidv4(),
            actor_user_id: actor.id,
            actor_display_name: actor.profile?.display_name || '',
            actor_username: actor.username || '',
            actor_thumbnail: actor.profile?.thumbnail || '',
            type: 'follow',
          })

          const commentAction: () => CommentNotificationActionInput = () => ({
            comment_id: uuidv4(),
            post_id: postIds[this.utils.randomNumber(posts.length - 1)] ?? uuidv4(),
            post_title: faker.lorem.sentence(5),
            post_url_slug: posts[2]?.url_slug || '',
            post_writer_username: u.username,
            comment_text: faker.lorem.sentence(8),
            actor_display_name: actor.profile?.display_name || '',
            actor_username: actor.username,
            actor_thumbnail: actor.profile?.thumbnail || '',
            type: 'comment',
          })

          const commentReplyAction: () => CommentReplyNotifictionActionInput = () => ({
            comment_id: uuidv4(),
            post_id: postIds[this.utils.randomNumber(posts.length - 1)] ?? uuidv4(),
            parent_comment_text: faker.lorem.sentence(8),
            post_title: faker.lorem.sentence(5),
            post_url_slug: posts[2]?.url_slug || '',
            post_writer_username: u.username,
            actor_display_name: actor.profile?.display_name || '',
            actor_username: actor.username,
            actor_thumbnail: actor.profile?.thumbnail || '',
            reply_comment_text: faker.lorem.sentence(8),
            type: 'commentReply',
          })

          const postLikeAction: () => PostLikeNotificationActionInput = () => ({
            post_like_id: uuidv4(),
            post_id: postIds[this.utils.randomNumber(posts.length - 1)] ?? uuidv4(),
            post_title: faker.lorem.sentence(5) || '',
            post_url_slug: posts[2]?.url_slug || '',
            post_writer_username: u.username,
            actor_username: actor?.username || '',
            actor_display_name: actor?.profile?.display_name || '',
            actor_thumbnail: actor.profile?.thumbnail || '',
            url_slug: posts[0]?.url_slug || '',
            fk_user_id: actor.id,
            type: 'postLike',
          })

          const actionSelector = [commentAction, commentReplyAction, postLikeAction, followerAction]

          const notificationMocks = actionSelector.map((v) => v())
          const promises = notificationMocks.map((action: any) => {
            return this.db.notification.create({
              data: {
                fk_user_id: u.id,
                actor_id: actor.id,
                action_id: action?.follow_id || action?.comment_id || action?.post_like_id,
                action,
                type: action.type,
              },
            })
          })

          await Promise.all(promises)
        } catch (error) {
          console.log('create notification Error', error)
        }
      }
    })
  }
}

const CREATE_USER_COUNT = 20

async function main() {
  try {
    const db = new DbService()
    const utils = new UtilsService()
    const seeder = new Seeder(db, utils)

    const mockUserWithProfile = getMockUserWithProfile(CREATE_USER_COUNT)
    const createUsers = seeder.createUser(mockUserWithProfile)
    const users = await Promise.all(createUsers)

    const carrick = users.find((u) => u.username === 'carrick')
    const targetUser = [carrick!].concat(users.slice(0, 3)).filter(Boolean)

    const createPosts = seeder.createPost(targetUser, mockPosts)
    const posts = await Promise.all(createPosts)

    const createComments = seeder.createComment(posts, mockComment, users.slice(0, 200))
    await Promise.all(createComments)

    const createnotifications = await seeder.createNotification(targetUser)
    await Promise.all(createnotifications)
  } catch (error) {
    console.log('err, error', error)
  }
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
