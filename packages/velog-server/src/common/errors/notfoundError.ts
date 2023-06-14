import { HttpError } from "@common/errors/httpError";

export class NotFoundError extends HttpError {
  constructor(description = "NOT_FOUND") {
    super(description, 404);
  }
}
