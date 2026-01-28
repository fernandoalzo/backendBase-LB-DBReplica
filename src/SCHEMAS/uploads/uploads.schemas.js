const Joi = require("joi");

const imageNameSchema = Joi.object({
    imageName: Joi.string()
        .trim()
        .regex(/^[a-zA-Z0-9-_]+\.[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.empty": 'Error: "imageName" cannot be empty.',
            "string.base": 'Error: "imageName" must be a string.',
            "string.pattern.base":
                'Error: "imageName" contains invalid characters or has invalid format.',
            "any.required": 'Error: "imageName" is required.'
        })
    });

module.exports = { imageNameSchema };