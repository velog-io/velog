export class HttpError extends Error {
  message
  statusCode
  name
  constructor(message: string, statusCode: number, name: string) {
    super()
    this.message = message
    this.statusCode = statusCode
    this.name = name
    // Ensure the stack trace is captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const isHttpError = (e: unknown): e is HttpError => e instanceof HttpError
