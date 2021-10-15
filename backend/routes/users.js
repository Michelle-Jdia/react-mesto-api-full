const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getMe,
  getUser,
  getUsers,
  updateUser,
  updateAvatarUser,
} = require("../controllers/users");

const validateUrl = (value) => {
  const result = validator.isURL(value);
  if (!result) {
    throw new Error('Введена некорректная ссылка');
  }

  return value;
};
router.get("/me", getMe);
router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);

router.get("/", getUsers);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch("/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
}), updateAvatarUser);

module.exports = router;