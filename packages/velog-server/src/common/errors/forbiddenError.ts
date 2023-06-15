import { HttpError } from '@common/errors/httpError.js'

export class ForbiddenError extends HttpError {
  constructor(description = 'FORBIDDEN') {
    super(description, 403)
  }
}
