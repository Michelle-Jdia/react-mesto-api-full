require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');
const { errors, celebrate, Joi } = require('celebrate');

const usersRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const allowedCors = [
  'https://api.tyumen-777.nomoredomains.monster',
  'https://tyumen-777.nomoredomains.club',
  'https://localhost:3000',
];

app.use(cors({
  origin: allowedCors,
}));

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required()
        .pattern(new RegExp('^[A-Za-z0-9]{8,30}$')),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.use(auth);
app.use('/', usersRoutes);
app.use('/', cardRoutes);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err);
  if (err.kind === 'ObjectId') {
    res.status(400).send({
      message: 'Неверно переданы данные',
    });
  } else {
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
