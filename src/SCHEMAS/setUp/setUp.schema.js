const Joi = require("joi");

const step = Joi.string();

const setUpSchema = Joi.object({
  step: step.required(),
});

module.exports = {
  setUpSchema,
};
