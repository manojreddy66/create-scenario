const Joi = require("joi");
const { MONTHS } = require("constants/customConstants");

const getValidationSchema = async () => {
  const schema = Joi.object({
    type: Joi.string().required().valid("Getsudo", "AP").messages({
      "any.required":
        "ValidationError: type must be a string, and can either be Getsudo or AP.",
      "string.base":
        "ValidationError: type must be a string, and can either be Getsudo or AP.",
      "any.only":
        "ValidationError: type must be a string, and can either be Getsudo or AP.",
      "string.empty":
        "ValidationError: type must be a string, and can either be Getsudo or AP.",
    }),
    namc: Joi.string().required().messages({
      "any.required": "ValidationError: namc is required and must be a string.",
      "string.base": "ValidationError: namc is required and must be a string.",
      "string.empty": "ValidationError: namc is required and must be a string.",
    }),
    line: Joi.string().required().messages({
      "any.required": "ValidationError: line is required and must be a string.",
      "string.base": "ValidationError: line is required and must be a string.",
      "string.empty": "ValidationError: line is required and must be a string.",
    }),
    startMonth: Joi.string()
      .required()
      .valid(...MONTHS)
      .messages({
        "any.required":
          "ValidationError: startMonth is required and must be a 3-character string.",
        "string.base":
          "ValidationError: startMonth is required and must be a 3-character string.",
        "any.only":
          "ValidationError: startMonth is required and must be a 3-character string.",
        "string.empty":
          "ValidationError: startMonth is required and must be a 3-character string.",
      }),
    startYear: Joi.string()
      .required()
      .pattern(/^\d{4}$/)
      .messages({
        "any.required":
          "ValidationError: startYear is required and must be a 4-character string.",
        "string.base":
          "ValidationError: startYear is required and must be a 4-character string.",
        "string.pattern.base":
          "ValidationError: startYear is required and must be a 4-character string.",
        "string.empty":
          "ValidationError: startYear is required and must be a 4-character string.",
      }),
    endMonth: Joi.string()
      .required()
      .valid(...MONTHS)
      .messages({
        "any.required":
          "ValidationError: endMonth is required and must be a 3-character string.",
        "string.base":
          "ValidationError: endMonth is required and must be a 3-character string.",
        "any.only":
          "ValidationError: endMonth is required and must be a 3-character string.",
        "string.empty":
          "ValidationError: endMonth is required and must be a 3-character string.",
      }),
    endYear: Joi.string()
      .required()
      .pattern(/^\d{4}$/)
      .messages({
        "any.required":
          "ValidationError: endYear is required and must be a 4-character string.",
        "string.base":
          "ValidationError: endYear is required and must be a 4-character string.",
        "string.pattern.base":
          "ValidationError: endYear is required and must be a 4-character string.",
        "string.empty":
          "ValidationError: endYear is required and must be a 4-character string.",
      }),
    userName: Joi.string().required().messages({
      "any.required":
        "ValidationError: userName is required and must be a string.",
      "string.base":
        "ValidationError: userName is required and must be a string.",
      "string.empty":
        "ValidationError: userName is required and must be a string.",
    }),
    userEmail: Joi.string()
      .required()
      .email({ tlds: { allow: ["com"] } })
      .messages({
        "any.required":
          "ValidationError: userEmail is required and must be a string.",
        "string.base":
          "ValidationError: userEmail is required and must be a string.",
        "string.email.tlds": "ValidationError: Invalid userEmail.",
        "any.only":
          "ValidationError: userEmail is required and must be a string.",
        "string.empty":
          "ValidationError: userEmail is required and must be a string.",
        "string.email": "ValidationError: Invalid userEmail.",
      }),
  });
  return schema;
};

module.exports = {
  getValidationSchema,
};
