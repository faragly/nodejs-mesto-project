import { hash } from 'bcrypt';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';

import { MONGO_DUPLICATE_ERROR, StatusCodes } from '../constants';
import {
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../errors';
import User, { type User as TUser } from '../models/user';
import { AuthContext } from '../types/types';

dotenv.config();
const { JWT_SECRET = 'secret-key', NODE_ENV = 'development' } = process.env;

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data: Omit<TUser, 'password'> = {
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      name: req.body.name,
    };
    const passwordHash = await hash(req.body.password, 10);
    const { _id: id } = await User.create({ ...data, password: passwordHash });
    const user = await User.findById(id).select('-password');
    res.status(StatusCodes.CREATED).send(user);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      next(new ValidationError(err.message));
    } else if (
      err instanceof Error &&
      err.message.includes(MONGO_DUPLICATE_ERROR.toString())
    ) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(err);
    }
  }
}

export async function getCurrentUser(
  _req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const id = res.locals.user._id;
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findUserByCredentials(
      req.body.email,
      req.body.password,
    );

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
      {
        expiresIn: '7d',
      },
    );
    res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: 10800000,
        sameSite: true,
      })
      .send({ message: 'Авторизация успешна' });
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).send({ message: err.message });
    } else {
      next(err);
    }
  }
}

export async function updateUserAvatar(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const data: Pick<TUser, 'avatar'> = { avatar: req.body.avatar };
    const user = await User.findByIdAndUpdate(res.locals.user._id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      next(new ValidationError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
}

export async function updateUserInfo(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const data: Pick<TUser, 'about' | 'name'> = {
      about: req.body.about,
      name: req.body.name,
    };
    const user = await User.findByIdAndUpdate(res.locals.user._id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}
