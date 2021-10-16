const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getMe,
} = require('../controllers/users');

usersRouter.get('/users/me', getMe);

usersRouter.get('/users', getUsers);

usersRouter.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().min(24)
        .max(24),
    }),
  }),
  getUserById,
);

usersRouter.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }), updateUser);

usersRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = usersRouter;
