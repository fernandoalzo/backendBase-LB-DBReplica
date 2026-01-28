const Joi = require("joi");

const token = Joi.string();

const tokenSchema = Joi.object({
  token: token.required(),
});

module.exports = {
  tokenSchema,
};
