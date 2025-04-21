import { StatusCodes } from '../constants';

export class ValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.VALIDATION_ERROR;
  }
}
