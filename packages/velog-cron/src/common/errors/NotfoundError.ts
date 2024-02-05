import { HttpError } from './HttpError.js'

export class NotFoundError extends HttpError {
  constructor(message = 'NOT_FOUND') {
    super('not found', message, 404)
  }
}
