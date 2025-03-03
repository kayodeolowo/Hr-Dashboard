import Joi from "joi";

export const employeeSchema = Joi.object({
  avatar: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "Avatar must be a valid URL",
    }),

  firstName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      "any.required": "First name is required",
      "string.empty": "First name is required",
      "string.min": "First name must be at least 1 character long",
      "string.max": "First name cannot exceed 50 characters",
    }),

  lastName: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      "any.required": "Last name is required",
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 1 character long",
      "string.max": "Last name cannot exceed 50 characters",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),

  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      "any.required": "Phone number is required",
      "string.empty": "Phone number is required",
      "string.pattern.base": "Please provide a valid phone number in E.164 format",
    }),

  dateOfBirth: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required()
    .messages({
      "any.required": "Date of birth is required",
      "string.empty": "Date of birth is required",
      "string.pattern.base": "Date of birth must be in the format DD-MM-YYYY",
    }),

  documents: Joi.array()
    .items(Joi.string().uri())
    .optional()
    .messages({
      "string.uri": "All document URLs must be valid",
    }),

  maritalStatus: Joi.string()
    .valid("Single", "Married", "Divorced", "Widowed")
    .optional()
    .messages({
      "any.only": "Marital status must be one of: Single, Married, Divorced, or Widowed",
    }),

  gender: Joi.string()
    .valid("Male", "Female", "OtherS")
    .required()
    .messages({
      "any.required": "Gender is required",
      "string.empty": "Gender is required",
      "any.only": "Gender must be one of: Male, Female, or OtherS",
    }),

  nationality: Joi.string()
    .min(1)
    .required()
    .messages({
      "any.required": "Nationality is required",
      "string.empty": "Nationality is required",
      "string.min": "Nationality must not be empty",
    }),

  address: Joi.string()
    .min(1)
    .required()
    .messages({
      "any.required": "Address is required",
      "string.empty": "Address is required",
      "string.min": "Address must not be empty",
    }),

  city: Joi.string()
    .min(1)
    .required()
    .messages({
      "any.required": "City is required",
      "string.empty": "City is required",
      "string.min": "City must not be empty",
    }),

  state: Joi.string()
    .min(1)
    .required()
    .messages({
      "any.required": "State is required",
      "string.empty": "State is required",
      "string.min": "State must not be empty",
    }),

    department: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "any.required": "Department ID is required",
      "string.empty": "Department ID is required",
      "string.pattern.base": "Department ID must be a valid MongoDB ObjectID",
    }),


  joinDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required()
    .messages({
      "any.required": "Join date is required",
      "string.empty": "Join date is required",
      "string.pattern.base": "Join date must be in the format DD-MM-YYYY",
    }),

  roleType: Joi.string()
    .min(1)
    .required()
    .messages({
      "any.required": "Role type is required",
      "string.empty": "Role type is required",
      "string.min": "Role type must not be empty",
    }),


    jobStatus: Joi.string()
    .min(1)
    .required()
    .messages({
      "any.required": "Job status is required",
      "string.empty": "Job status is required",
      "string.min": "Job status must not be empty",
    }),
});