import { HttpError } from './HttpError.js'

export class ForbiddenError extends HttpError {
  constructor(description = 'FORBIDDEN') {
    super(description, 403, 'Forbidden')
  }
}
