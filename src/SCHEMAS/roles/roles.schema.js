const Joi = require("joi");

const id = Joi.number().positive().min(1).max(20);
const name = Joi.string().alphanum().min(3).max(30);

const createRoleSchema = Joi.object({
  name: name.required(),
});

const updateRoleSchema = Joi.object({
  name,
});

const roleIdSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createRoleSchema,
  updateRoleSchema,
  roleIdSchema,
};
