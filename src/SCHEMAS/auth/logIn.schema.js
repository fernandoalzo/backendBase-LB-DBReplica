const Joi = require("joi");

const username = Joi.string();
const password = Joi.string().min(1);

const logInSchema = Joi.object({
  username: username.required(),
  password: password.required(),
});

module.exports = {
  logInSchema,
};
