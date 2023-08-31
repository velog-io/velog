import { injectable, singleton } from 'tsyringe'
import B2 from 'backblaze-b2'
import { ENV } from '@env'

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

  public async upload(buffer: Buffer, path: string) {
    await this.authorize()
    const { authorizationToken, uploadUrl } = await this.getUploadUrl()
    const result = await this.b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName: path,
      data: buffer,
      axios: {
        timeout: 250000,
      },
    })
    const fileId: string = result.data.fileId
    return {
      url: `https://velog.velcdn.com/${path}`,
      fileId,
    }
  }
}
