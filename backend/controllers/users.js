const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Conflict = require("../errors/conflict");
const Unauthorized = require("../errors/unauthorized");

const SALT_ROUNDS = 10;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;


const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким ID не найден');
      res.send(user);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Запрашиваемый пользователь не найден");
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequest("Невалидный id "));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200).send({
      data: {
        name, about, avatar, email,
      },
    }))

    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new Conflict('Пользователь с указанным email уже существует'));
      } else if (err.name === "ValidationError") {
        next(new BadRequest(
          `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        ));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Запрашиваемый пользователь не найден");
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest("Некорректные данные"));
      } else {
        next(err);
      }
    });
};

const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Запрашиваемый пользователь не найден");
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequest("Некорректные данные"));
      } else {
        next(err);
      }
    });
};


const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        })
        .then((checkedUser) => {
          const token = jwt.sign({ _id: checkedUser._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' });
          return res.cookie('mestoToken', token, {
            maxAge: 360000,
            httpOnly: true,
            sameSite: true,
          })
            .send({ token });
        })
        .catch(() => {
          next(new Unauthorized('Неверный логин или пароль'));
        });
    })
    .catch(() => {
      next(new Unauthorized('Неверный логин или пароль'));
    });
};

module.exports = {
  getMe,
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatarUser,
  login,
};
