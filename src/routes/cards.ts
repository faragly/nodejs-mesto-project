import { Router } from 'express';

import {
  CARD_ID_VALIDATORS,
  CREATE_CARD_VALIDATORS,
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', ...CREATE_CARD_VALIDATORS, createCard);
router.delete('/:id', ...CARD_ID_VALIDATORS, deleteCard);
router.put('/:id/likes', ...CARD_ID_VALIDATORS, likeCard);
router.delete('/:id/likes', ...CARD_ID_VALIDATORS, dislikeCard);

export default router;
