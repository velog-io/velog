import { HttpError } from "@common/errors/httpError";

export class BadRequestError extends HttpError {
  constructor(description = "BAD_REQUEST") {
    super(description, 400);
  }
}
