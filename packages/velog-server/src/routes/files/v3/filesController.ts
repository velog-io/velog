import Axios from 'axios'
import { injectable, singleton } from 'tsyringe'
import { AwsService } from '@lib/aws/AwsService.js'
import { CreateUrlBody, UploadBody } from './schema'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { UserService } from '@services/UserService/index.js'
import { DbService } from '@lib/db/DbService.js'
import { FileService } from '@lib/file/FileService.js'
import { ENV } from '@env'
import { File } from 'fastify-multer/lib/interfaces'
import { BadRequestError } from '@errors/BadRequestErrors.js'

interface Controller {
  createUrl({ body, ipaddr, signedUserId, ip }: CreateUrlArgs): Promise<CreateUrlResult>
}

@singleton()
@injectable()
export class FilesController implements Controller {
  constructor(
    private readonly db: DbService,
    private readonly file: FileService,
    private readonly aws: AwsService,
    private readonly userService: UserService,
  ) {}
  public async createUrl({
    body,
    ipaddr,
    signedUserId,
    ip,
  }: CreateUrlArgs): Promise<CreateUrlResult> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const { type, filename, refId } = body
    try {
      const loader = this.userService.userLoader()
      const user = await loader.load(signedUserId)

      const userImage = await this.db.userImage.create({
        data: {
          fk_user_id: signedUserId,
          type,
          ref_id: refId || null,
        },
      })

      const path = this.file.generateUploadPath({ type, id: userImage.id, username: user.username })

      if (ENV.blacklistUsername.includes(user.username) || ENV.blacklistIp.includes(ipaddr || ip)) {
        await Axios.post(ENV.slackUrl, {
          text: `blacklist uploaded image | ${ip} ${user.username}`,
        })
      }

      const signedUrl = await this.aws.generateSignedUrl(path, filename)
      await this.db.userImage.update({
        where: {
          id: userImage.id,
        },
        data: {
          path: `${path}/${filename}`,
        },
      })

      return {
        image_path: `https://media.vlpt.us/${userImage.path}`,
        signed_url: signedUrl,
      }
    } catch (error) {
      throw error
    }
  }
  public async upload({ body, file, signedUserId }: UploadArgs): Promise<UploadResult> {
    const { type, ref_id } = body

    if (!['post', 'profile'].includes(type)) {
      throw new BadRequestError('Invalid type')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new UnauthorizedError('Invalid User')
    }
  }
}

type CreateUrlArgs = {
  body: CreateUrlBody
  ipaddr: string | null
  ip: string
  signedUserId?: string
}

type CreateUrlResult = {
  image_path: string
  signed_url: string
}

type UploadArgs = {
  body: UploadBody
  file: File
  signedUserId: string
}

type UploadResult = {
  path: string
}
