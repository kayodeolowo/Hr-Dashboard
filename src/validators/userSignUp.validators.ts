import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address"
    }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "any.required": "First name is required",
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters long",
      "string.max": "First name cannot exceed 50 characters"
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "any.required": "Last name is required",
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters long",
      "string.max": "Last name cannot exceed 50 characters"
    }),

  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "any.required": "Username is required",
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 30 characters",
      "string.pattern.base": "Username can only contain letters, numbers, and underscores"
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      "any.required": "Confirm password is required",
      "string.empty": "Confirm password is required",
      "any.only": "Passwords do not match"
    })
});