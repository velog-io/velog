import { HttpError } from './HttpError.js'

export class UnauthorizedError extends HttpError {
  constructor(description = 'Unauthorized') {
    super(description, 401, 'unauthorized')
  }
}
