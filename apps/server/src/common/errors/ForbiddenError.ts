import { HttpError } from './HttpError.js'

export class ForbiddenError extends HttpError {
  constructor(message = 'FORBIDDEN') {
    super('forbidden', message, 403)
  }
}
