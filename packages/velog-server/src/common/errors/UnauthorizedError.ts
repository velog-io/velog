import { HttpError } from './HttpError.js'

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super('unauthorized', message, 401)
  }
}
