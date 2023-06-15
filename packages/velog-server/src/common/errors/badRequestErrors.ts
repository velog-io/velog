import { HttpError } from "@common/errors/httpError.js";

export class BadRequestError extends HttpError {
  constructor(description = "BAD_REQUEST") {
    super(description, 400);
  }
}
