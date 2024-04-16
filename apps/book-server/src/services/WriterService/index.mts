import { Writer } from '@graphql/generated.js'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findById(writerId: string): Promise<Writer | null>
}

@injectable()
@singleton()
export class WriterService implements Service {
  constructor(private readonly mongo: MongoService) {}
  public async findById(writerId: string): Promise<Writer | null> {
    return await this.mongo.writer.findUnique({
      where: {
        id: writerId,
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
}

type CreateArgs = {
  fk_user_id: string
  pen_name: string
  email: string
  short_bio: string | null
}
