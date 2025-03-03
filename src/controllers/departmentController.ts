import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { departmentModel } from '../models/departmentModel';
import { departmentSchema } from '../validators/department.validators';
import { sendSuccessResponse } from '../utils/sendSuccessResponse';
import employeeModel from '../models/employeeModel';
import { EmployeeTypes } from 'interface/employee.interface';

interface IDepartment {
    name: string;
    totalEmployees: number;
    employees: EmployeeTypes[]; 
  }
  
  // Get All Departments
  export const getAllDepartments = asyncHandler(async (req: Request, res: Response) => {

    const departments = await departmentModel.find().sort({ createdAt: -1 });
  
    // Get employee counts and first 5 employees for each department
    const departmentsWithDetails: IDepartment[] = await Promise.all(
      departments.map(async (department) => {
        const totalEmployees = await employeeModel.countDocuments({ department: department._id });
  
        // Fetch the first 5 employees for the department
        const employees = await employeeModel.find({ department: department._id }).limit(5);
  
        // Convert to plain object and cast to IDepartment
        const departmentObj: IDepartment = {
          totalEmployees,
          ...department.toObject(),
          employees,
        };
  
        return departmentObj;
      })
    );
  
    sendSuccessResponse(res, "Departments fetched successfully", {
      data: departmentsWithDetails,
    });
  });
  
   
 

  // Add Department
export const addDepartment = asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = departmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400);
      throw new Error(error.details.map((err) => err.message).join(", "));
    }
  
    const { name } = value;
  
    const existingDepartment = await departmentModel.findOne({ name });
    if (existingDepartment) {
      res.status(400);
      throw new Error("A department with this name already exists.");
    }
  
    const department = await departmentModel.create({ name });
  
    sendSuccessResponse(res, "Department added successfully", {
      data: department,
    });
  });

// Get Department by ID
export const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = req.params.id;
  
    // Find the department
    const department = await departmentModel.findById(departmentId);
    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }
  
    // Get total number of employees in this department
    const totalEmployees = await employeeModel.countDocuments({ department: departmentId });
  
    // Fetch all employees in the department
    const employees = await employeeModel
      .find({ department: departmentId })
      .select("_id firstName lastName email phoneNumber roleType jobStatus"); // Select only needed fields
  
    sendSuccessResponse(res, "Department fetched successfully", {
      data: {
        ...department.toObject(),
        totalEmployees,
        employees,
      },
    });
  });
  

// Update Department
export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
    const departmentId = req.params.id;
  
    const { error, value } = departmentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400);
      throw new Error(error.details.map((err) => err.message).join(", "));
    }
  
    const { name } = value;
  
    // Check if a department with the same name exists (excluding the current one)
    const existingDepartment = await departmentModel.findOne({
      name,
      _id: { $ne: departmentId },
    });
  
    if (existingDepartment) {
      res.status(400);
      throw new Error("A department with this name already exists.");
    }
  
    const department = await departmentModel.findByIdAndUpdate(
      departmentId,
      { name },
      { new: true, runValidators: true }
    );
  
    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }
  
    sendSuccessResponse(res, "Department updated successfully", {
        data: department,
      });
  });
  