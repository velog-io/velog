import { FastifyPluginCallback } from 'fastify'
import { FromSchema } from 'json-schema-to-ts'
import { container } from 'tsyringe'
import multer from 'fastify-multer'
import { CreateUrlBody, UploadBody, createUrlBodySchema } from './schema.js'
import { FilesController } from './filesController.js'
import authGuardPlugin from '@plugins/encapsulated/authGuardPlugin.js'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  const controller = container.resolve(FilesController)
  const upload = multer({
    limits: {
      fileSize: 1024 * 1024 * 30,
    },
  })

  // fastify.register(authGuardPlugin)
  fastify.post<{ Body: CreateUrlBody }>(
    '/create-url',
    {
      schema: {
        body: createUrlBodySchema,
      },
    },
    async (request, reply) => {
      try {
        return await controller.createUrl({
          body: request.body,
          ip: request.ip,
          ipaddr: request.ipaddr,
          signedUserId: request.user?.id,
        })
      } catch (error: any) {
        if (error.name === 'ContentTypeError') {
          reply.status(400).send('BAD_REQUEST')
          return
        }
        reply.status(500).send('INTERNAL_SERVER_ERROR')
        return
      }
    },
  )

  fastify.post<{ Body: UploadBody }>(
    '/upload',
    {
      preHandler: upload.single('image'),
    },
    (request, relpy) => {
      console.log(request.file)
      relpy.send({ message: 'hello' })
    },
  )

  done()
}

export default v3
