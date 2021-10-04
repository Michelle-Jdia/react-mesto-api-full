const { celebrate, Joi } = require('celebrate');
const routerUser = require('express').Router();
const {
  findAllUsers,
  findUserById,
  updateProfile,
  updateAvatar,
  infoAboutUser,
} = require('../controllers/users');

routerUser.get('/users', findAllUsers);

routerUser.get('/users/me', infoAboutUser);

routerUser.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), findUserById);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

routerUser.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
  }),
}), updateAvatar);
module.exports = routerUser;