import { HttpError } from './HttpError.js'

export class ConfilctError extends HttpError {
  constructor(message = 'CONFILCT') {
    super('confilct', message, 409)
  }
}
