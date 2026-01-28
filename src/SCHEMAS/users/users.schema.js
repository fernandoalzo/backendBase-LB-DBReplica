const Joi = require("joi");

const id = Joi.number().positive().min(1).max(20);
const username = Joi.string().alphanum().min(3).max(30);
const documentId = Joi.number().positive();
const email = Joi.string().email();
const phone = Joi.number().positive();
const password = Joi.string().min(6).max(30);
const address = Joi.string().min(3).max(100);
const enabled = Joi.boolean();
const reputation = Joi.number().min(0).max(1000);
const verified = Joi.boolean();
const roleId = Joi.number().positive();

const createClientSchema = Joi.object({
  username: username.required(),
  documentId: documentId.required(),
  email: email.required(),
  phone: phone.required(),
  password: password.required(),
  address: address.required(),
  enabled: enabled.required(),
  reputation: reputation.required(),
  verified: verified.required(),
  roleId: roleId.required(),
});

const updateClientSchema = Joi.object({
  username,
  documentId,
  email,
  phone,
  password,
  address,
  enabled,
  reputation,
  verified,
  roleId,
});

const userIdSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createClientSchema,
  updateClientSchema,
  userIdSchema,
};
