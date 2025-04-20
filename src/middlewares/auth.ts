import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { StatusCodes } from '../constants';
import { AuthContext } from '../types/types';

dotenv.config();
const { JWT_SECRET, NODE_ENV } = process.env;

const authMiddleware = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { cookies } = req;

    if (!cookies || !cookies.jwt) {
      throw new Error('Необходима авторизация');
    }

    const payload = jwt.verify(
      cookies.jwt,
      NODE_ENV === 'production' ? JWT_SECRET! : 'secret-key',
    );
    res.locals.user = payload as { _id: string };

    next();
  } catch {
    res
      .status(StatusCodes.NOT_AUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
};

export default authMiddleware;
