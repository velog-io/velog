import 'reflect-metadata'
import { DbService } from '@lib/db/DbService'
import { UtilsService } from '@lib/utils/UtilsService'
import { Post, Prisma, User } from '@prisma/client'
import { ENV, EnvVars } from '@env'
import { mockComment } from 'test/mock/mockComment'
import { MockPostsType, mockPosts } from 'test/mock/mockPost'
import { mockUserWithProfile, MockUserWithProfileType } from 'test/mock/mockUser'

const MAX_COMMENTS_PER_POST = 5

class Seeder {
  constructor(private readonly db: DbService, private readonly utils: UtilsService) {}
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
          },
        })
      })
  }
  public createComment(
    posts: Post[],
    comments: Prisma.CommentUncheckedCreateInput[],
    users: User[]
  ) {
    return posts
      .map((post) =>
        this.utils
          .shuffle<Prisma.CommentUncheckedCreateInput>(comments)
          .slice(0, MAX_COMMENTS_PER_POST)
          .map((comment) => ({ ...comment, fk_post_id: post.id }))
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
}

async function main() {
  try {
    const db = new DbService()
    const utils = new UtilsService()
    const seeder = new Seeder(db, utils)

    const createUsers = seeder.createUser(mockUserWithProfile)
    const users = await Promise.all(createUsers)

    const createPosts = seeder.createPost(users, mockPosts)
    const posts = await Promise.all(createPosts)

    const createComments = seeder.createComment(posts, mockComment, users)
    await Promise.all(createComments)
  } catch (error) {
    throw error
  }
}

function checkAppEnv(env: EnvVars) {
  if (env.appEnv !== 'development') {
    throw Error('Only Allow development environment')
  }
}

function checkDatabaseUrl(env: EnvVars) {
  if (env.databaseUrl.indexOf('localhost') < 0) {
    throw new Error('Database host must be localhost')
  }
}

checkAppEnv(ENV)
checkDatabaseUrl(ENV)
main()
