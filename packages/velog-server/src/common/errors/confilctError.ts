import { HttpError } from "@common/errors/httpError";

export class ConfilctError extends HttpError {
  constructor(description = "CONFILCT") {
    super(description, 409);
  }
}
