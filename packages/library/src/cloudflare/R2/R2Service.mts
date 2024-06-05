import { HeadBucketCommand, S3Client as R2 } from '@aws-sdk/client-s3'

interface Service {}

export class R2Service implements Service {
  private endpoint: string
  private r2!: R2
  private uri: string
  private name: string
  constructor({ accountId, region, accessKeyId, secretAccessKey, bucketName }: ServiceArgs) {
    this.endpoint = new URL(`https://${accountId}.r2.cloudflarestorage.com`).origin
    this.uri = `${this.endpoint}/${bucketName}`
    this.name = bucketName

    this.r2 = new R2({
      endpoint: this.endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }
  public async exists(): Promise<boolean> {
    try {
      const result = await this.r2.send(
        new HeadBucketCommand({
          Bucket: this.name,
        }),
      )
      return result.$metadata.httpStatusCode === 200
    } catch {
      return false
    }
  }
}

type ServiceArgs = {
  accountId: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
}
