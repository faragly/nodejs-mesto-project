import { ErrorCodes } from '../constants/errors';

export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorCodes.VALIDATION_ERROR;
  }
}
