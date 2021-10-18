const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const NotAuthError = require('../errors/not-auth-error');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new NotAuthError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new NotAuthError('Неверный токен');
  }
  req.user = payload;
  next();
};