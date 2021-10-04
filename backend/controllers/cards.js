/* eslint-disable no-undef */
const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errNew = new Error('При создании карточки передали некорректные данные');
        errNew.statusCode = 400;
        next(errNew);
      }
      next(err);
    });
};

module.exports.findAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.findByIdAndRemoveCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка с указанным _id не найдена');
        err.statusCode = 404;
        next(err);
      } else if (req.user._id === data.owner._id.toString()) {
        const errNew = new Error('Отказано');
        errNew.statusCode = 403;

        next(errNew);
      } else {
        card.remove().then(() => res.send({ data: card }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNew = new Error('Некорректные данные');
        errNew.statusCode = 400;
        next(errNew);
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(

    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Пользователь с указанным id не найден');
        err.statusCode = 404;

        next(err);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNew = new Error('Переданы некорректные данные для лайка');
        errNew.statusCode = 400;
        next(err);
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Пользователь с указанным id не найдена');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNew = new Error('Переданы некорректные данные для лайка');
        errNew.statusCode = 400;
        next(errNew);
      }
      next(err);
    });
};