import { HttpError } from './HttpError.mjs'

export class ForbiddenError extends HttpError {
  constructor(message = 'FORBIDDEN') {
    super('forbidden', message, 403)
  }
}
