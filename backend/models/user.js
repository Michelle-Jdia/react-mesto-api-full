const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Michelle Jdia',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Developer',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^(http:\/\/|https:\/\/w*\w)/.test(v);
      },
      message: 'Ссылка некорректна',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'введите правильный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    validate: {
      validator(v) {
        return validator.isStrongPassword(v);
      },
      message: 'Ваш пароль не является надежным',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
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
        });
    });
};

module.exports = mongoose.model('user', userSchema);
