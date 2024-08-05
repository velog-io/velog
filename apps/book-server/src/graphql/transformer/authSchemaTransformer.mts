import { UnauthorizedError } from '@errors/UnauthorizedError.mjs'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { GraphQLContext } from '@interfaces/graphql.mjs'
import { GraphQLSchema } from 'graphql'

export const authSchemaTransformer = (schema: GraphQLSchema) =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0]
      if (authDirective) {
        const { resolve } = fieldConfig
        fieldConfig.resolve = function (source, args, context: GraphQLContext, info) {
          if (!context.writer?.id) {
            throw new UnauthorizedError('Unauthorized')
          }
          if (!resolve) return undefined
          return resolve(source, args, context, info)
        }
        return fieldConfig
      }
    },
  })
