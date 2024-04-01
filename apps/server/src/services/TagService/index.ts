import DataLoader from 'dataloader'
import { DbService } from '@lib/db/DbService.js'
import { Prisma, Tag } from '@packages/database/src/velog-rds/index.mjs'
import { injectable, singleton } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { UserService } from '@services/UserService/index.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UserTags } from '@graphql/helpers/generated'

interface Service {
  findByNameFiltered(name: string): Promise<Tag | null>
  findById(tagId: string): Promise<Tag | null>
  findByName(name: string): Promise<Tag | null>
  tagLoader(): DataLoader<string, Tag[]>
  getOriginTag(tagname: string): Promise<Tag | null>
  getUserTags(username: string, signedUserId?: string): Promise<GetUserTagsResult>
  findOrCreate(name: string): Promise<Tag>
}

@injectable()
@singleton()
export class TagService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
    private readonly userService: UserService,
  ) {}
  public async findByNameFiltered(name: string): Promise<Tag | null> {
    return await this.db.tag.findFirst({
      where: {
        name_filtered: name,
      },
    })
  }
  public async findById(tagId: string): Promise<Tag | null> {
    return await this.db.tag.findUnique({
      where: {
        id: tagId,
      },
    })
  }

  public async findByName(name: string): Promise<Tag | null> {
    const filtered = this.utils.escapeForUrl(name).toLowerCase()
    return await this.db.tag.findFirst({
      where: {
        OR: [{ name_filtered: filtered }, { name: name }],
      },
    })
  }

  public tagLoader() {
    return this.createTagsLoader()
  }
  private createTagsLoader(): DataLoader<string, Tag[]> {
    return new DataLoader(async (postIds) => {
      const postsTags = await this.db.postTag.findMany({
        where: {
          fk_post_id: {
            in: postIds as string[],
          },
        },
        include: {
          tag: true,
        },
        orderBy: [
          { fk_post_id: 'asc' },
          {
            tag: {
              name: 'asc',
            },
          },
        ],
      })
      return this.utils
        .groupById<Prisma.PostTagGetPayload<{ include: { tag: true } }>>(
          postIds as string[],
          postsTags,
          (pt) => pt.fk_post_id!,
        )
        .map((array) => array.map((pt) => pt.tag!))
    })
  }

  public async getOriginTag(tagname: string): Promise<Tag | null> {
    const filtered = this.utils.escapeForUrl(tagname).toLowerCase()

    const tag = await this.db.tag.findFirst({
      where: {
        name_filtered: filtered,
      },
    })
    if (!tag) return null
    if (tag.is_alias) {
      const alias = await this.db.tagAlias.findFirst({
        where: {
          fk_tag_id: tag.id,
        },
      })
      if (!alias) return null
      const originTag = await this.db.tag.findUnique({
        where: {
          id: alias.fk_alias_tag_id,
        },
      })
      return originTag
    }
    return tag
  }

  public async getUserTags(username: string, signedUserId?: string): Promise<GetUserTagsResult> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('Not found User')
    }

    const isSelf = user.id === signedUserId
    const tags = await this.getUserPostTags(user.id, isSelf)

    // TODO: get total posts count and return
    const postsCount = await this.db.post.count({
      where: {
        fk_user_id: user.id,
        is_temp: false,
        ...(isSelf ? {} : { is_private: false }),
      },
    })

    // prevents wrong tags conflict with public tag posts_count
    const transformedTags = tags.map((tag) => ({ ...tag, id: `${user.id}:${tag.id}` }))

    // transform id for user tag
    return {
      tags: transformedTags,
      posts_count: postsCount,
    }
  }
  private async getUserPostTags(
    userId: string,
    isShowPrivate: boolean,
  ): Promise<GetUserPostTagsResult[]> {
    // The original type of posts_count is bigint in SQL.
    const rawData = await this.db.$queryRawUnsafe<GetUserPostTagsResult[]>(
      `
        select tags.id, tags.name, tags.created_at, tags.description, tags.thumbnail, posts_count from (
        select count(fk_post_id) as posts_count, fk_tag_id from posts_tags
        inner join posts on posts.id = fk_post_id
          and posts.is_temp = false
          and posts.fk_user_id = $1::uuid
          ${isShowPrivate ? '' : 'and posts.is_private = false'}
        group by fk_tag_id
      ) as q inner join tags on q.fk_tag_id = tags.id
      order by posts_count desc
    `,
      userId,
    )

    return rawData.map((data) => ({ ...data, posts_count: Number(data.posts_count) }))
  }

  public async findOrCreate(name: string): Promise<Tag> {
    const tag = await this.findByName(name)
    if (tag) return tag

    const filtered = this.utils.escapeForUrl(name).toLowerCase()
    try {
      const freshTag = await this.db.tag.create({
        data: {
          name,
          name_filtered: filtered,
        },
      })
      return freshTag
    } catch (error) {
      console.log('create tag error', error)
      console.log('name', name)
      console.log('name_filtered', filtered)
      const tag = await this.db.tag.findFirst({
        where: {
          name: name,
        },
      })
      return tag!
    }
  }
}

type GetUserPostTagsResult = Tag & { posts_count: number }
type GetUserTagsResult = UserTags
