import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from '../constants';

const errorMiddleware = (
  err: { statusCode: number } & Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message, statusCode = StatusCodes.SERVER_ERROR } = err;

  res.status(statusCode).send({
    message:
      statusCode === StatusCodes.SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    status: 'error',
  });

  next();
};

export default errorMiddleware;
