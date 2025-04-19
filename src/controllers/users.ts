import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import { NotFoundError, ValidationError } from '../errors';
import User from '../models/user';
import { AuthContext } from '../types/types';

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.create({
      about: req.body.about,
      avatar: req.body.avatar,
      name: req.body.name,
    });
    res.status(201).send(user);
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      next(new ValidationError('Переданы некорректные данные'));
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

export async function updateUserAvatar(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const user = await User.findByIdAndUpdate(
      res.locals.user._id,
      { avatar: req.body.avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      throw new NotFoundError('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    if (err instanceof Error.CastError) {
      next(new ValidationError('Некорректный тип данных'));
    } else if (err instanceof Error.ValidationError) {
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
    const user = await User.findByIdAndUpdate(res.locals.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError('Пользователь с таким идентификатором не найден');
    }

    res.send(user);
  } catch (err) {
    if (err instanceof Error.CastError) {
      next(new ValidationError('Некорректный тип данных'));
    } else if (err instanceof Error.ValidationError) {
      next(new ValidationError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
}
