import { body } from 'express-validator';

export const LOGIN_VALIDATORS = [
  body('email').isEmail().notEmpty(),
  body('password').isString().notEmpty(),
];
