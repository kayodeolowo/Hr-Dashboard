import Joi from 'joi';

export const departmentSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Department name is required',
    'any.required': 'Department name is required',
  }),
});