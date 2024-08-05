import { HttpError } from './HttpError.mjs'

export class ConfilctError extends HttpError {
  constructor(message = 'CONFILCT') {
    super('confilct', message, 409)
  }
}
