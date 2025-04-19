import { Router } from 'express';

import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

export default router;
