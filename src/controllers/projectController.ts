import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import mongoose from "mongoose";
import projectModel from "../models/projectModel";
import employeeModel from "../models/employeeModel";
import { paginateQuery } from "../helpers/paginate";

const addProject = asyncHandler(async (req: Request, res: Response) => {
    // Get employee ID from the request body instead of params
    const { projectName, startDate, finishDate, status, employeeId } = req.body;
  
    // Validate employee ID format
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      res.status(400);
      throw new Error("Invalid employee ID.");
    }
  
    // Find the employee by _id
    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      res.status(404);
      throw new Error("Employee not found.");
    }
  
    // Validate required fields
    if (!projectName || !startDate || !finishDate || !status) {
      res.status(400);
      throw new Error("All project fields are required.");
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
  
    res.status(201).json({
      status: "success",
      message: "Project added successfully",
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
  res.status(200).json({
    status: "success",
    message: "Projects fetched successfully",
    data: paginatedResult.data,
    pagination: {
      totalItems: paginatedResult.totalItems,
      totalPages: paginatedResult.totalPages,
      currentPage: paginatedResult.currentPage,
    },
  });
});

export { addProject, getEmployeeProjects };