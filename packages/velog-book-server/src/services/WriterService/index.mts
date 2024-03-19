import { MongoService } from '@lib/mongo/MongoService.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class WriterService implements Service {
  constructor(private readonly mongo: MongoService) {}
  public findById(writerId: string) {
    return this.mongo.writer.findUnique({
      where: {
        id: writerId,
      },
    })
  }
}
