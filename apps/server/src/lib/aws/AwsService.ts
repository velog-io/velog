import { injectable, singleton } from 'tsyringe'
import { SESClient } from '@aws-sdk/client-ses'
import { S3Client } from '@aws-sdk/client-s3'
import mime from 'mime-types'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { ENV } from 'src/env.mjs'

interface Service {
  generateSignedUrl(path: string, filename: string): Promise<string>
}

@injectable()
@singleton()
export class AwsService implements Service {
  get ses() {
    return new SESClient({ region: 'us-east-1' })
  }

  get s3() {
    return new S3Client({
      region: 'ap-northeast-2',
    })
  }

  public async generateSignedUrl(path: string, filename: string): Promise<string> {
    const contentType = mime.lookup(filename)
    if (!contentType) {
      const error = new Error('Failed to parse Content-Type from filename')
      error.name = 'ContentTypeError'
      throw error
    }
    if (!contentType.includes('image')) {
      const error = new Error('Given file is not a image')
      error.name = 'ContentTypeError'
      throw error
    }
    const uploadPath = `${path}/${filename}`
    const command = new GetObjectCommand({
      Bucket: ENV.bucketName,
      Key: uploadPath,
      ResponseContentType: contentType,
    })
    return await getSignedUrl(this.s3, command, { expiresIn: 3600 })
  }
}
