import { Router } from 'express';

import {
  getCurrentUser,
  getUserById,
  getUsers,
  UPDATE_AVATAR_VALIDATORS,
  UPDATE_USER_VALIDATORS,
  updateUserAvatar,
  updateUserInfo,
  USER_ID_VALIDATORS,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', ...USER_ID_VALIDATORS, getUserById);
router.patch('/me', ...UPDATE_USER_VALIDATORS, updateUserInfo);
router.patch('/me/avatar', ...UPDATE_AVATAR_VALIDATORS, updateUserAvatar);

export default router;
