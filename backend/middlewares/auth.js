const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;
    next(err);
  }

  const {
    token,
  } = req.cookies.jwt;
  const { JWT_SECRET = 'dev-key' } = process.env;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret')
  } catch (err) {
    const errNew = new Error('Ошибка авторизации');
    errNew.statusCode = 401;
    next(errNew);
  }
  req.user = payload;
  next();
};