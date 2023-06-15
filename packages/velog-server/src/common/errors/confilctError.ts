import { HttpError } from '@common/errors/httpError.js'

export class ConfilctError extends HttpError {
  constructor(description = 'CONFILCT') {
    super(description, 409)
  }
}
