import fs from 'fs'
import {
  S3Client,
  ListBucketsCommand,
  Bucket,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'

type Params = {
  region?: string
}

interface Service {}

export class AwsS3Service implements Service {
  public client!: S3Client
  constructor({ region = 'ap-northeast-2' }: Params) {
    this.client = new S3Client({ region: region })
  }
  public async getBuckets(): Promise<Bucket[]> {
    try {
      const command = new ListBucketsCommand({})
      const data = await this.client.send(command)
      return data.Buckets ?? []
    } catch (error: any) {
      console.error('get buckets error')
      const { requestId, cfId, extendedRequestId } = error.$metadata
      console.log({ requestId, cfId, extendedRequestId })
      return []
    }
  }
  public async uploadFile({ bucketName, key, body, ...args }: UploadFileArgs): Promise<void> {
    const buckets = await this.getBuckets()
    const bucket = buckets.find((bucket) => bucket.Name === bucketName)

    if (!bucket) {
      throw new Error('Bucket not found')
    }

    const input: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ...args,
    }
    const command = new PutObjectCommand(input)
    const response = await this.client.send(command)
    console.log(response)
  }
}

type UploadFileArgs = {
  bucketName: string
  key: string
  body: fs.ReadStream | Buffer | string
} & Omit<PutObjectCommandInput, 'Bucket' | 'Key' | 'Body'>
