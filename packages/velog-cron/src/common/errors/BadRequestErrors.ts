import { HttpError } from './HttpError.js'

export class BadRequestError extends HttpError {
  constructor(message = 'BAD_REQUEST') {
    super(message, 400, 'BadRequest')
  }
}
