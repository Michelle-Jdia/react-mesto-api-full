require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');
// mongoose.connect('mongodb://localhost:27017/mestodb');
// const { PORT = 3000 } = process.env;
const app = express();

app.use(cors({
  origin: [
    'https://mest.michelle.nomoredomains.club',
    'http://mest.michelle.nomoredomains.club',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://84.201.129.89',
    'https://84.201.129.89',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
const { PORT = 5000 } = process.env;
const CONNECTION_URL = 'mongodb+srv://admin:admin123@cluster0.cn2lj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(auth);
app.use('/', routerUser);
app.use('/', routerCards);
app.use('*', (req, res, next) => {
  const err = new Error('Cтраница не найдена');
  err.statusCode = 404;

  next(err);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect(
  CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true },
).then(() => {
  app.listen(PORT, () => console.log(`server is runnig on port: ${PORT}`));
}).catch((err) => console.log(err.message));
