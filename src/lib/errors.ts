/**
 * Typed HTTP error used by the service layer. API endpoints catch it and
 * serialise the message — raw Prisma/database errors are never exposed.
 */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
