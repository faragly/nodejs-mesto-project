import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

import { StatusCodes } from '../constants/status-codes';
import { NotFoundError, ValidationError } from '../errors';
import Card from '../models/card';
import { AuthContext } from '../types/types';

export async function createCard(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const card = await Card.create({
      link: req.body.link,
      name: req.body.name,
      owner: res.locals.user._id,
    });
    res.status(StatusCodes.CREATED).send(card);
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      next(new ValidationError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
}

export async function deleteCard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(StatusCodes.OK).send(card);
  } catch (err) {
    next(err);
  }
}

export async function dislikeCard(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: res.locals.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Такой карточки не существует');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
}

export async function getCards(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
}

export async function likeCard(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: res.locals.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Такой карточки не существует');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
}
