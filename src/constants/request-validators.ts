import { celebrate, Joi, Segments } from 'celebrate';

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object({
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().alphanum().required().length(24),
  }),
});

export const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    name: Joi.string().min(2).max(30),
  }),
});

export const validateAvatarUpdate = celebrate({
  [Segments.BODY]: Joi.object({
    avatar: Joi.string().required().uri(),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      link: Joi.string().required().uri(),
      name: Joi.string().required().min(2).max(30),
    })
    .unknown(true),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().alphanum().required().length(24),
  }),
});
