import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import mongoose from "mongoose";
import projectModel from "../models/projectModel";
import employeeModel from "../models/employeeModel";

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
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid employee ID.");
    }
  
    const projects = await projectModel.find({ employeeId: id });
  
    if (projects.length === 0) {
      res.status(404);
      throw new Error("No projects found for this employee.");
    }
  
    res.status(200).json({
      status: "success",
      data: projects,
    });
});

export { addProject, getEmployeeProjects };