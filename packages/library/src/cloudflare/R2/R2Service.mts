import { HeadBucketCommand, PutObjectCommand, S3Client as R2 } from '@aws-sdk/client-s3'

interface Service {
  exists(): Promise<boolean>
  upload(args: UploadArgs): Promise<UploadFileResponse>
}

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
  public async upload({
    contents,
    destination,
    customMetadata,
    mimeType,
  }: UploadArgs): Promise<UploadFileResponse> {
    destination = destination.startsWith('/') ? destination.replace(/^\/+/, '') : destination

    const result = await this.r2.send(
      new PutObjectCommand({
        Bucket: this.name,
        Key: destination,
        Body: contents,
        ContentType: mimeType || 'application/octet-stream',
        Metadata: customMetadata,
      }),
    )

    return {
      objectKey: destination,
      uri: `${this.uri}/${destination}`,
      etag: result.ETag,
      versionId: result.VersionId,
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

type UploadArgs = {
  contents: string | Uint8Array | Buffer | ReadableStream
  destination: string
  customMetadata?: Record<string, string>
  mimeType?: string
}

type UploadFileResponse = {
  objectKey: string
  uri: string
  etag?: string
  versionId?: string
}
