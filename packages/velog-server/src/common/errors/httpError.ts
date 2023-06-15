export class HttpError extends Error {
  description
  statusCode
  constructor(description: string, statusCode: number) {
    super()
    this.description = description
    this.statusCode = statusCode
  }
}

export const isHttpError = (e: unknown): e is HttpError =>
  e instanceof HttpError
