import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthError } from '../errors';
import { AuthContext } from '../types/types';

dotenv.config();
const { JWT_SECRET = 'secret-key', NODE_ENV = 'development' } = process.env;

const authMiddleware = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  try {
    const { cookies } = req;

    if (!cookies || !cookies.jwt) {
      throw new AuthError('Необходима авторизация');
    }

    const payload = jwt.verify(
      cookies.jwt,
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
    );
    res.locals.user = payload as { _id: string };

    next();
  } catch {
    next(new AuthError('Необходима авторизация'));
  }
};

export default authMiddleware;
