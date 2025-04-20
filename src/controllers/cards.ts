import { NextFunction, Request, Response } from 'express';
import {
  body,
  matchedData,
  param,
  Result,
  ValidationError,
  validationResult,
} from 'express-validator';

import { StatusCodes } from '../constants';
import Card, { type Card as TCard } from '../models/card';
import { AuthContext } from '../types/types';

export const CARD_ID_VALIDATORS = [param('id').isMongoId()];

export const CREATE_CARD_VALIDATORS = [
  body('name').isString().isLength({ max: 30, min: 2 }),
  body('link').isURL(),
];

export async function createCard(
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

    const data = matchedData<Pick<TCard, 'link' | 'name'>>(req);
    const card = await Card.create({
      ...data,
      owner: res.locals.user._id,
    });
    res.status(StatusCodes.CREATED).send(card);
  } catch (err) {
    next(err);
  }
}

export async function deleteCard(
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

    const userId = res.locals.user._id;
    const { id } = matchedData<{ id: string }>(req);
    const card = await Card.findById(id);

    if (!card) {
      res.status(StatusCodes.NOT_FOUND).send('Карточка не найдена');
    } else if (card.owner.toString() !== userId) {
      res.status(StatusCodes.FORBIDDEN).send('Доступ к операции запрещён');
    }

    await Card.findByIdAndDelete(id);
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
    const result: Result<ValidationError> = validationResult(req);

    if (!result.isEmpty()) {
      res
        .status(StatusCodes.VALIDATION_ERROR)
        .send('Переданы некорректные данные');
    }

    const { id } = matchedData<{ id: string }>(req);
    const card = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: res.locals.user._id } },
      { new: true },
    );

    if (!card) {
      res.status(StatusCodes.NOT_FOUND).send('Карточка не найдена');
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
    const result: Result<ValidationError> = validationResult(req);

    if (!result.isEmpty()) {
      res
        .status(StatusCodes.VALIDATION_ERROR)
        .send('Переданы некорректные данные');
    }

    const { id } = matchedData<{ id: string }>(req);
    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: res.locals.user._id } },
      { new: true },
    );

    if (!card) {
      res.status(StatusCodes.NOT_FOUND).send('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
}
