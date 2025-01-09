import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import mongoose from "mongoose";
import projectModel from "../models/projectModel";
import employeeModel from "../models/employeeModel";
import { paginateQuery } from "../helpers/paginate";
import { sendSuccessResponse } from "../utils/sendSuccessResponse";
import { addProjectSchema } from "../validators/project.validators";

const addProject = asyncHandler(async (req: Request, res: Response) => {

    // Validate request body with Joi schema
    const { error } = addProjectSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400);
      throw new Error(error.details.map((err) => err.message).join(", "));
    }

    
  const { projectName, startDate, finishDate, status, employeeId } = req.body;

  

  const [startDay, startMonth, startYear] = startDate.split("-").map(Number);
  const [finishDay, finishMonth, finishYear] = finishDate.split("-").map(Number);

  const start = new Date(startYear, startMonth - 1, startDay);
  const finish = new Date(finishYear, finishMonth - 1, finishDay);

  if (finish <= start) {
    res.status(400);
    throw new Error("Finish Date must be later than Start Date.");
  }



  // Check if employee ID is valid and exists in the database
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    res.status(400);
    throw new Error("Invalid employee ID.");
  }

  const employee = await employeeModel.findById(employeeId);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found.");
  }

  // Create a new project for the employee
  const projectData = {
    projectName,
    startDate,
    finishDate,
    status,
    employeeId: employee._id,
  };

  // Save the project to the database
  const newProject = await projectModel.create(projectData);

  sendSuccessResponse(res, "Project added successfully", {
    data: newProject,
  });
});

// GET request keeps the id in the URL
const getEmployeeProjects = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1; // Default page 1 if not provided
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10; // Default pageSize 10 if not provided

  // Check if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid employee ID.");
  }

  // Filter for projects by employeeId
  const filter = { employeeId: id };

  // Use paginateQuery to get paginated results
  const paginatedResult = await paginateQuery(projectModel, filter, page, pageSize);

  // If no projects found, throw an error
  if (paginatedResult.data.length === 0) {
    res.status(404);
    throw new Error("No projects found for this employee.");
  }

  // Send the paginated result in the response
  sendSuccessResponse(res, "Projects fetched successfully", {
    all_projects: paginatedResult.data,
    pagination: {
      totalItems: paginatedResult.totalItems,
      totalPages: paginatedResult.totalPages,
      currentPage: paginatedResult.currentPage,
    },
  });
});

export { addProject, getEmployeeProjects };