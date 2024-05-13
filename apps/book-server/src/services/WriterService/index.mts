import { Time } from '@constants/TimeConstants.mjs'
import { Writer } from '@graphql/generated.js'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findById(writerId: string): Promise<Writer | null>
  findByFkUserId(fkUserId: string): Promise<Writer | null>
  create(args: CreateArgs): Promise<Writer>
  checkExistsWriter(fkUserId?: string): Promise<CheckExistsWriterResult>
}

@injectable()
@singleton()
export class WriterService implements Service {
  constructor(private readonly mongo: MongoService, private readonly redis: RedisService) {}
  public async findById(writerId: string): Promise<Writer | null> {
    return await this.mongo.writer.findUnique({
      where: {
        id: writerId,
      },
    })
  }
  public async findByFkUserId(userId: string): Promise<Writer | null> {
    return await this.mongo.writer.findUnique({
      where: {
        fk_user_id: userId,
      },
    })
  }
  public async create({
    fk_user_id,
    username,
    email,
    short_bio,
    display_name,
    thumbnail,
  }: CreateArgs): Promise<Writer> {
    const exists = await this.mongo.writer.findUnique({
      where: {
        fk_user_id,
      },
    })

    if (exists) {
      return exists
    }

    const writer = await this.mongo.writer.create({
      data: {
        fk_user_id,
        username,
        email,
        short_bio,
        display_name,
        thumbnail,
      },
    })

    return writer
  }
  public async checkExistsWriter(fkUserId?: string): Promise<CheckExistsWriterResult> {
    if (!fkUserId) return { exists: false }

    const key = this.redis.generateKey.existsWriter(fkUserId)
    const [value, writer] = await Promise.all([this.redis.get(key), this.findByFkUserId(fkUserId)])

    if (value) {
      return {
        exists: true,
        writerId: value,
      }
    }

    if (!writer) return { exists: false }

    await this.redis.set(key, writer.id, 'EX', Time.ONE_MINUTE_IN_S * 10)

    return {
      exists: true,
      writerId: writer.id,
    }
  }
}

type CreateArgs = {
  fk_user_id: string
  username: string
  email: string
  short_bio: string | null
  display_name: string
  thumbnail: string
}

type CheckExistsWriterResult =
  | {
      exists: false
      writerId?: undefined
    }
  | { exists: true; writerId: string }
