import { ListBucketsCommand, S3Client as R2 } from '@aws-sdk/client-s3'

interface Service {}

export class R2Service implements Service {
  private endpoint: string
  private r2!: R2
  constructor({ r2ApiKey }: ServiceArgs) {
    this.endpoint = r2ApiKey
    this.r2 = new R2({
      endpoint: this.endpoint,
      region: 'auto',
    })
  }
  public async getBuckets() {
    try {
      const command = new ListBucketsCommand({})
      const data = await this.r2.send(command)
      return data.Buckets ?? []
    } catch (error) {
      console.error('get buckets error', error)
      return []
    }
  }
}

type ServiceArgs = {
  r2ApiKey: string
}
