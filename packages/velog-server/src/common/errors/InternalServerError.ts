import { HttpError } from './HttpError.js'

export class InternalServerError extends HttpError {
  constructor(description = 'INTERNAL_SERVER_ERROR') {
    super(description, 500, 'internal server error')
  }
}
