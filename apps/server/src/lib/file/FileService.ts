import axios from 'axios'
import { injectable, singleton } from 'tsyringe'
import mimeTypes from 'mime-types'
import tmp from 'tmp'
import fs from 'fs'
import path from 'path'
import multer from 'fastify-multer'
import { StorageEngine } from 'fastify-multer/lib/interfaces.js'

interface Service {
  get multerStorage(): StorageEngine
  downloadFile(url: string): Promise<DownloadFileResult>
  generateUploadPath(parmeter: GenerateUploadPathParameter): string
}

@injectable()
@singleton()
export class FileService implements Service {
  get multerStorage() {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/images')
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, `${file.fieldname + '-' + Date.now()}.${ext}`)
      },
    })
    return storage
  }
  async downloadFile(url: string) {
    const response = await axios.get(encodeURI(url), {
      responseType: 'stream',
    })
    const contentType = response.headers['content-type']
    const extension = mimeTypes.extension(contentType)

    const tmpObject = tmp.fileSync()
    const writeStream = fs.createWriteStream(tmpObject.name)
    response.data.pipe(writeStream)

    await new Promise<void>((resolve) => {
      writeStream.on('finish', () => {
        resolve()
      })
    })

    const cleanup = () => {
      tmpObject.removeCallback()
    }

    const stream = fs.createReadStream(tmpObject.name)
    const stats = fs.statSync(tmpObject.name)
    return {
      stream,
      extension,
      contentType,
      stats,
      cleanup,
    }
  }
  public generateUploadPath = ({ id, type, username }: GenerateUploadPathParameter) => {
    return `images/${username}/${type}/${id}`
  }
}

type DownloadFileResult = {
  stream: fs.ReadStream
  extension: string | false
  contentType: any
  stats: fs.Stats
  cleanup: () => void
}

type GenerateUploadPathParameter = {
  id: string
  type: string
  username: string
}
