import { HttpError } from './HttpError.js'

export class ConfilctError extends HttpError {
  constructor(description = 'CONFILCT') {
    super(description, 409, 'confilct')
  }
}
