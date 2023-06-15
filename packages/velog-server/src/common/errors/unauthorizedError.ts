import { HttpError } from './httpError.js'

export class UnauthorizedError extends HttpError {
  constructor(description = 'Unauthorized') {
    super(description, 401)
  }
}
