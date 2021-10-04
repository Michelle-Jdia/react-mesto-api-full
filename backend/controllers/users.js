
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }).then(() => res.status(200).send({
        data: {
          name,
          about,
          avatar,
          email,
        },
      }))
        .catch((err) => {
          if (err.code === 11000) {
            const errNew = new Error('Пользователь уже зарегистрирован');
            errNew.statusCode = 409;
            next(errNew);
          }
          if (err.name === 'ValidationError') {
            const errNew = new Error('Переданы некорректные данные при создании пользователя');
            errNew.statusCode = 400;
            next(errNew);
          }
          next(err);
        });
    });
};

module.exports.findAllUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным id не найден');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errNew = new Error('Переданы некорректные данные');
        errNew.statusCode = 400;
        next(err);
      }
      next(err);
    });
};

module.exports.infoAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным id не найден');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным id не найден');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({
          data: user,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errNew = new Error('Переданы некорректные данные при обновлении профиля');
        errNew.statusCode = 400;
        next(errNew);
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным id не найден');
        err.statusCode = 404;
        next(err);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errNew = new Error('Переданы некорректные данные при обновлении аватара');
        errNew.statusCode = 400;
        next(errNew);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;
        next(err);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('Неправильные почта или пароль');
            err.statusCode = 401;
            next(err);
          }

          return user;
        });
    })
    .then((user) => {
      res.cookie('jwt', { token: jwt.sign({ _id: user._id }, 'super-strong-secret') }, {
        maxAge: 604800,
        httpOnly: true,
      })
        .status(200)
        .send({ message: 'Успешно зарегистрирован' });
    })
    .catch(next);
};