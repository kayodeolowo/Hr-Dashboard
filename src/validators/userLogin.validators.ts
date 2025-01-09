import Joi from "joi";

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address"
    }),

  password: Joi.string()
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password is required"
    })
});