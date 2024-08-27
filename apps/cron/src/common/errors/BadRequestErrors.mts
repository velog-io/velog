import { HttpError } from './HttpError.mjs'

export class BadRequestError extends HttpError {
  constructor(message = 'BAD_REQUEST') {
    super('bad request', message, 400)
  }
}
