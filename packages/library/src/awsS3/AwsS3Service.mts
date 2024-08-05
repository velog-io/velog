import fs from 'fs'
import {
  S3Client,
  Bucket,
  ListBucketsCommand,
  PutObjectCommand,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  GetObjectCommand,
  type GetObjectCommandInput,
  type GetObjectCommandOutput,
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
  type DeleteObjectCommandOutput,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3'

type Params = {
  region?: string
}

interface Service {
  getBuckets(): Promise<Bucket[]>
  getObject(args: GetObjectArgs): Promise<GetObjectCommandOutput>
  deleteObject(args: DeleteObject): Promise<DeleteObjectCommandOutput>
  uploadFile(args: UploadFileArgs): Promise<PutObjectCommandOutput>
}

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
      console.error('get buckets error', error)
      const { requestId, cfId, extendedRequestId } = error.$metadata
      console.log({ requestId, cfId, extendedRequestId })
      return []
    }
  }
  private async checkBucketExist(bucketName: string) {
    const buckets = await this.getBuckets()
    const bucket = buckets.find((bucket) => bucket.Name === bucketName)
    if (!bucket) {
      throw new Error('Bucket not found')
    }
  }
  public async getObject({ bucketName, key }: GetObjectArgs): Promise<GetObjectCommandOutput> {
    await this.checkBucketExist(bucketName)
    const input: GetObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
    }

    const command = new GetObjectCommand(input)
    return await this.client.send(command)
  }
  public async deleteObject({
    bucketName,
    key,
  }: GetObjectArgs): Promise<DeleteObjectCommandOutput> {
    await this.checkBucketExist(bucketName)
    const input: DeleteObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
    }
    const command = new DeleteObjectCommand(input)
    return await this.client.send(command)
  }
  public async deleteFolder({ bucketName, key }: DeleteFolder) {
    await this.checkBucketExist(bucketName)
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: key,
    })
    const listResponse = await this.client.send(listCommand)

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      const deleteParams = {
        Bucket: bucketName,
        Delete: { Objects: listResponse.Contents.map(({ Key }) => ({ Key })) },
      }
      const deleteCommand = new DeleteObjectsCommand(deleteParams)
      await this.client.send(deleteCommand)
    }
  }
  public async uploadFile({
    bucketName,
    key,
    body,
    ...args
  }: UploadFileArgs): Promise<PutObjectCommandOutput> {
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
    return await this.client.send(command)
  }
  public async deleteFile(key: string) {}
}

type UploadFileArgs = {
  bucketName: string
  key: string
  body: fs.ReadStream | Buffer | string
} & Omit<PutObjectCommandInput, 'Bucket' | 'Key' | 'Body'>

type GetObjectArgs = {
  bucketName: string
  key: string
}

type DeleteObject = GetObjectArgs

type DeleteFolder = GetObjectArgs
