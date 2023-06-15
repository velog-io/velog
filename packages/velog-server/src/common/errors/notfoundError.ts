import { HttpError } from "@common/errors/httpError.js";

export class NotFoundError extends HttpError {
  constructor(description = "NOT_FOUND") {
    super(description, 404);
  }
}
