import { hash } from 'bcrypt';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import {
  body,
  matchedData,
  param,
  Result,
  ValidationError,
  validationResult,
} from 'express-validator';
import jwt from 'jsonwebtoken';

import { MONGO_DUPLICATE_ERROR, StatusCodes } from '../constants';
import { AuthError } from '../errors/auth-error';
import User, { type User as TUser } from '../models/user';
import { AuthContext } from '../types/types';

dotenv.config();
const { JWT_SECRET, NODE_ENV } = process.env;

export const UPDATE_USER_VALIDATORS = [
  body('name').isString().isLength({ max: 30, min: 2 }),
  body('about').isString().isLength({ max: 30, min: 2 }),
  body('avatar').isURL(),
];

export const CREATE_USER_VALIDATORS = UPDATE_USER_VALIDATORS.concat([
  body('email').isEmail(),
  body('password').isString(),
]);

export const USER_ID_VALIDATORS = [param('id').isMongoId()];

export const UPDATE_AVATAR_VALIDATORS = [body('avatar').isURL()];

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result: Result<ValidationError> = validationResult(req);

    if (!result.isEmpty()) {
      res
        .status(StatusCodes.VALIDATION_ERROR)
        .send('Переданы некорректные данные');
    }

    const data = matchedData<TUser>(req);
    const passwordHash = await hash(data.password, 10);
    const user = await User.create({ ...data, password: passwordHash });
    res.status(201).send(user);
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes(MONGO_DUPLICATE_ERROR.toString())
    ) {
      res
        .status(StatusCodes.CONFLICT)
        .send({ message: 'Пользователь с таким email уже существует' });
    } else {
      next(err);
    }
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result: Result<ValidationError> = validationResult(req);

    if (!result.isEmpty()) {
      res
        .status(StatusCodes.VALIDATION_ERROR)
        .send('Переданы некорректные данные');
    }

    const { id } = matchedData<{ id: string }>(req);
    const user = await User.findById(id);

    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send('Пользователь с таким идентификатором не найден');
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
    const { email, password } =
      matchedData<Pick<TUser, 'email' | 'password'>>(req);

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET! : 'secret-key',
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
    const result: Result<ValidationError> = validationResult(req);

    if (!result.isEmpty()) {
      res
        .status(StatusCodes.VALIDATION_ERROR)
        .send('Переданы некорректные данные');
    }

    const data = matchedData<Pick<TUser, 'avatar'>>(req);
    const user = await User.findByIdAndUpdate(res.locals.user._id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUserInfo(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const result: Result<ValidationError> = validationResult(req);

    if (!result.isEmpty()) {
      res
        .status(StatusCodes.VALIDATION_ERROR)
        .send('Переданы некорректные данные');
    }

    const data = matchedData<Pick<TUser, 'about' | 'name'>>(req);
    const user = await User.findByIdAndUpdate(res.locals.user._id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}
