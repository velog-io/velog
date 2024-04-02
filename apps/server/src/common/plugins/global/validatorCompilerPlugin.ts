// const Ajv = require('ajv')
import Ajv from 'ajv'
import { FastifyPluginAsync } from 'fastify'

const schemaCompilers = {
  body: new Ajv.default({
    removeAdditional: true,
    coerceTypes: false,
    allErrors: true,
  }),
  params: new Ajv.default({
    removeAdditional: true,
    coerceTypes: true,
    allErrors: true,
  }),
  querystring: new Ajv.default({
    removeAdditional: true,
    coerceTypes: true,
    allErrors: true,
  }),
  headers: new Ajv.default({
    removeAdditional: true,
    coerceTypes: true,
    allErrors: true,
  }),
}

const validatorCompiler: FastifyPluginAsync = async (fastify) => {
  fastify.setValidatorCompiler((request) => {
    if (!request.httpPart) {
      throw new Error('Missing httpPart')
    }
    const compiler = (schemaCompilers as Record<string, any>)[request.httpPart]
    if (!compiler) {
      throw new Error(`Missing compiler for ${request.httpPart}`)
    }
    return compiler.compile(request.schema)
  })
}

export default validatorCompiler
