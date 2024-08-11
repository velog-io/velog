import { injectable, singleton } from 'tsyringe'
import B2 from 'backblaze-b2'
import { ENV } from '@env'
import { finished } from 'stream/promises'
import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'

interface Service {
  authorize(): Promise<boolean>
  getUploadUrl(): Promise<{
    authorizationToken: string
    uploadUrl: string
  }>
  upload(
    buffer: Buffer,
    path: string,
  ): Promise<{
    url: string
    fileId: string
  }>
}

@injectable()
@singleton()
export class B2ManagerService implements Service {
  private instance?: B2
  private lastAuthorization?: Date

  private get b2() {
    if (!this.instance) {
      this.instance = new B2({
        applicationKeyId: ENV.b2KeyId,
        applicationKey: ENV.b2Key,
      })
    }
    return this.instance!
  }

  public async authorize() {
    // authorize every hour
    if (!this.lastAuthorization || Date.now() - this.lastAuthorization.getTime() > 1000 * 60 * 60) {
      console.log('authing')
      await this.b2.authorize()
      this.lastAuthorization = new Date()
    }
    return true
  }
  public async getUploadUrl() {
    const result = await this.b2.getUploadUrl({
      bucketId: ENV.b2BucketId!,
    })
    type UploadUrlResult = { authorizationToken: string; uploadUrl: string }
    const { authorizationToken, uploadUrl }: UploadUrlResult = result.data
    return { authorizationToken, uploadUrl }
  }

  public async streamUpload(stream: any, fileName: string, contentLength?: number) {
    const chunks: any[] = []
    stream.on('data', (chunk: string) => chunks.push(chunk))
    await finished(stream)

    const buffer = Buffer.concat(chunks)
    return this.upload(buffer, fileName, contentLength)
  }

  public async upload(buffer: Buffer, fileName: string, contentLength?: number) {
    await this.authorize()
    const { authorizationToken, uploadUrl } = await this.getUploadUrl()
    const result = await this.b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      data: buffer,
      contentLength,
      onUploadProgress: (e) => {
        console.log('onUploadProgress', e)
      },
    })
    const fileId: string = result.data.fileId

    return {
      url: `https://velog.velcdn.com/${fileName}`,
      fileId,
    }
  }
}
