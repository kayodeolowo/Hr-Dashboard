import Joi from "joi";

export const addProjectSchema = Joi.object({
  projectName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "Project name must be a string",
      "any.required": "Project name is required",
      "string.empty": "Project name is required",
      "string.min": "Project name must be at least 3 characters long",
      "string.max": "Project name cannot exceed 100 characters",
    }),
  
  startDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/) // Pattern for DD-MM-YYYY
    .required()
    .messages({
      "string.pattern.base": "Start Date must be in the format DD-MM-YYYY",
      "any.required": "Start Date is required",
      "string.empty": "Start Date is required",
    }),
  
  finishDate: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/) // Pattern for DD-MM-YYYY
    .required()
    .messages({
    "any.required": "Finish Date required",
      "string.pattern.base": "Finish Date must be in the format DD-MM-YYYY",
      "string.empty": "Finish Date is required",
    }),
  
  status: Joi.string()
    .valid("Pending", "In Progress", "Completed")
    .required()
    .messages({
      "any.only": "Status must be one of 'Pending', 'In Progress', or 'Completed'",
      "string.empty": "Status is required",
      "any.required": "status is required",
    }),
  
  employeeId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId format
    .required()
    .messages({
        "any.required": "Employee ID is required",
      "string.pattern.base": "Employee ID must be a valid ObjectId",
      "string.empty": "Employee ID is required",
    }),
});
