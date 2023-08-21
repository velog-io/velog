import { HttpError } from './HttpError.js'

export class NotFoundError extends HttpError {
  constructor(description = 'NOT_FOUND') {
    super(description, 404, 'NotFound')
  }
}
