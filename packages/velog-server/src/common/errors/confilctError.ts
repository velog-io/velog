import { HttpError } from './httpError.js'

export class ConfilctError extends HttpError {
  constructor(description = 'CONFILCT') {
    super(description, 409)
  }
}
