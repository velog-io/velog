import { injectable, singleton } from 'tsyringe'
import { AwsService } from '@lib/aws/AwsService.js'
import { CreateUrlBody, UploadBody } from './schema.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { UserService } from '@services/UserService/index.js'
import { DbService } from '@lib/db/DbService.js'
import { FileService } from '@lib/file/FileService.js'
import { ENV } from '@env'
import { File } from 'fastify-multer/lib/interfaces.js'
import { BadRequestError } from '@errors/BadRequestErrors.js'
import { ImageService } from '@services/ImageService/index.js'
import { HttpError } from '@errors/HttpError.js'
import { PostService } from '@services/PostService/index.js'
import { ForbiddenError } from '@errors/ForbiddenError.js'
import { B2ManagerService } from '@lib/b2Manager/B2ManagerService.js'
import { InternalServerError } from '@errors/InternalServerError.js'
import { axios } from 'src/commonjs/axios.js'

interface Controller {
  createUrl({ body, ipaddr, signedUserId, ip }: CreateUrlArgs): Promise<CreateUrlResult>
  upload({ body, file, signedUserId }: UploadArgs): Promise<UploadResult>
}

@singleton()
@injectable()
export class FilesController implements Controller {
  constructor(
    private readonly db: DbService,
    private readonly file: FileService,
    private readonly aws: AwsService,
    private readonly b2Manager: B2ManagerService,
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly imageService: ImageService,
  ) {}
  public async createUrl({
    body,
    ipaddr,
    signedUserId,
    ip,
  }: CreateUrlArgs): Promise<CreateUrlResult> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
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
        await axios.post(ENV.slackUrl, {
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
    if (!file) {
      throw new BadRequestError('Not found file')
    }

    const { type, ref_id } = body

    if (!['post', 'profile'].includes(type)) {
      throw new BadRequestError('Invalid type')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new UnauthorizedError('Invalid User')
    }

    const isAbuse = await this.imageService.detectAbuse(signedUserId)

    if (isAbuse) {
      throw new HttpError('Too many requests', 'is abused user', 429)
    }

    if (type === 'post' && !!ref_id) {
      const post = await this.postService.findById(ref_id)
      if (post?.fk_user_id !== signedUserId) {
        throw new ForbiddenError("Can't access the post")
      }
    }

    const userImage = await this.db.userImageNext.create({
      data: {
        filesize: file.size || 0,
        ref_id: ref_id ?? null,
        type,
        fk_user_id: signedUserId,
        tracked: type === 'profile' ? true : false,
      },
    })

    const originalFileName = file.originalname
    const extension = originalFileName.split('.').pop()
    const filename = `image.${extension}`

    const filepath = this.file
      .generateUploadPath({
        type,
        id: userImage.id,
        username: user.username,
      })
      .concat(`/${encodeURIComponent(decodeURI(filename))}`)

    if (type === 'profile') {
      this.imageService.untrackPastImages(signedUserId).catch(console.error)
    }

    try {
      const result = await this.b2Manager.upload(file.buffer!, filepath, file.size)

      await this.db.userImageNext.update({
        where: {
          id: userImage.id,
        },
        data: {
          path: filepath,
          file_id: result.fileId,
        },
      })

      return {
        path: result.url,
      }
    } catch (error) {
      console.log('Upload file error', error)
      throw new InternalServerError()
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
  file?: File
  signedUserId: string
}

type UploadResult = {
  path: string
}
