const Card = require("../models/card");
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest("Некорректные данные"));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Нет карточки по заданному id'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new Forbidden("Нельзя удалить чужую карточку");
      }
      return Card.deleteOne(card)
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Некорректный id"));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Невалидный id");
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Некорректный id"));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Невалидный id");
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Некорректный id"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
