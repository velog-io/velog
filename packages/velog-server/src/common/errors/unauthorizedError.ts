import { HttpError } from "@common/errors/httpError.js";

export class UnauthorizedError extends HttpError {
  constructor(description = "Unauthorized") {
    super(description, 401);
  }
}
