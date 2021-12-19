const { celebrate, Joi } = require('celebrate');
// создадим express router
const routerCards = require('express').Router();
// импортируем controllers
const {
  createCard,
  findAllCards,
  findByIdAndRemoveCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

routerCards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
  }),
}), createCard);

routerCards.get('/cards', findAllCards);

routerCards.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), findByIdAndRemoveCard);

routerCards.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

routerCards.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), dislikeCard);

module.exports = routerCards;
