import { Router } from 'express';

import {
  validateAvatarUpdate,
  validateUserId,
  validateUserUpdate,
} from '../constants/request-validators';
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validateUserId, getUserById);
router.patch('/me', validateUserUpdate, updateUserInfo);
router.patch('/me/avatar', validateAvatarUpdate, updateUserAvatar);

export default router;
