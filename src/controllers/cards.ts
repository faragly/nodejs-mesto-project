import { isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { StatusCodes } from '../constants';
import { ForbiddenError, NotFoundError, ValidationError } from '../errors';
import Card, { type Card as TCard } from '../models/card';
import { AuthContext } from '../types/types';

export async function createCard(
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) {
  try {
    const data: Pick<TCard, 'link' | 'name'> = {
      link: req.body.link,
      name: req.body.name,
    };
    const card = await Card.create({
      ...data,
      owner: res.locals.user._id,
    });
    res.status(StatusCodes.CREATED).send(card);
  } catch (err) {
    if (isCelebrateError(err) || err instanceof MongooseError.ValidationError) {
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
    const userId = res.locals.user._id;
    const card = await Card.findById(req.params.id);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    } else if (card.owner.toString() !== userId) {
      throw new ForbiddenError('Доступ к операции запрещён');
    }

    await Card.findByIdAndDelete(req.params.id);
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
      throw new NotFoundError('Карточка не найдена');
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
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
}
