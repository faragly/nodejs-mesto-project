import { ErrorCodes } from '../constants/errors';

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorCodes.NOT_AUTHORIZED;
  }
}
