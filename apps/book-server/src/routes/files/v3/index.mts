import { FastifyPluginCallback } from 'fastify'
import { container } from 'tsyringe'
import multer from 'fastify-multer'
import { UploadBody } from './schema.mjs'
import { FilesController } from './filesController.mjs'
import authGuardPlugin from '@plugins/encapsulated/authGuardPlugin.mjs'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(FilesController)

  const upload = multer({
    limits: {
      fileSize: 1024 * 1024 * 30,
    },
  })

  fastify.register(authGuardPlugin)

  fastify.post<{ Body: UploadBody }>(
    '/upload',
    {
      preHandler: upload.single('image'),
    },
    async (request) => {
      return await controller.upload({
        body: request.body,
        file: request.file,
        signedWriterId: request.writer?.id,
      })
    },
  )

  done()
}

export default v3
