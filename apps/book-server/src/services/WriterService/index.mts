import { Time } from '@constants/TimeConstants.mjs'
import { Writer } from '@graphql/generated.js'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findById(writerId: string): Promise<Writer | null>
  findByFkUserId(fkUserId: string): Promise<Writer | null>
  create(args: CreateArgs): Promise<Writer>
  checkExistsWriter(fkUserId: string): Promise<string | null>
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
  public async create({ fk_user_id, pen_name, email, short_bio }: CreateArgs): Promise<Writer> {
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
        pen_name,
        email,
        short_bio,
      },
    })

    return writer
  }
  public async checkExistsWriter(fkUserId?: string): Promise<string | null> {
    if (!fkUserId) return null

    const key = this.redis.generateKey.existsUser(fkUserId)
    const value = await this.redis.get(key)
    if (value) return value

    const writer = await this.findByFkUserId(fkUserId)
    if (!writer) return null

    await this.redis.set(key, writer.id, 'EX', Time.ONE_MINUTE_IN_S * 10)
    return writer.id
  }
}

type CreateArgs = {
  fk_user_id: string
  pen_name: string
  email: string
  short_bio: string | null
}
