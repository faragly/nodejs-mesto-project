import { NextFunction, Request, Response } from 'express';

import { AuthContext } from '../types/types';

const addUserId = (
  _req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  res.locals.user = {
    _id: '6803cf680b009b9f44987d41',
  };
  next();
};

export default addUserId;
