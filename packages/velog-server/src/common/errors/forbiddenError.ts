import { HttpError } from "@common/errors/httpError";

export class ForbiddenError extends HttpError {
  constructor(description = "FORBIDDEN") {
    super(description, 403);
  }
}
