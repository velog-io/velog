import { HttpStatus } from '@constants/HttpStatusConstants'
import { HttpStatusMessage } from '@constants/HttpStatusMesageConstants'
import { PostService } from '@services/PostService'
import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'

const v3: FastifyPluginCallback = (fastify, opts, done) => {
  const postService = container.resolve(PostService)

  fastify.patch<{ Params: { postId: string } }>('/score', async (request, reply) => {
    const { postId } = request.params
    await postService.updatePostScore(postId)
    reply.status(HttpStatus.OK).send(HttpStatusMessage.OK)
  })
  done()
}

export default v3
