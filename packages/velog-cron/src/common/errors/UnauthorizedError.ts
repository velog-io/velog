import { HttpError } from './HttpError.js'

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'Unauthorized')
  }
}
