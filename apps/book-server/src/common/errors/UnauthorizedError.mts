import { HttpError } from './HttpError.mjs'

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super('unauthorized', message, 401)
  }
}
