import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import employeeModel from "../models/employeeModel";
import { paginateQuery } from "../helpers/paginate";
import { validateAndFormatDate } from "../helpers/dateValidator";
import { generateUniqueEmployeeId } from "../helpers/uniqueEmployeeId";
import mongoose from "mongoose";
import { sendSuccessResponse } from "../utils/sendSuccessResponse";
import { employeeSchema } from "../validators/employee.validators";
import { departmentModel } from "../models/departmentModel";


// Add a new Employee
const addEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = employeeSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400);
    throw new Error(error.details.map((err) => err.message).join(", "));
  }

  const {
    avatar,
    firstName,
    lastName,
    email,
    phoneNumber,
    dateOfBirth,
    documents,
    maritalStatus,
    gender,
    nationality,
    address,
    city,
    state,
    department,
    joinDate,
    roleType,
    jobStatus
  } = value; 

  
  const existingEmployee = await employeeModel.findOne({ email });
  if (existingEmployee) {
    res.status(400);
    throw new Error("An employee with this email already exists.");
  }

  const existingPhoneNumber = await employeeModel.findOne({ phoneNumber });
  if (existingPhoneNumber) {
    res.status(400);
    throw new Error("An employee with this phone number already exists.");
  }


  const departmentExists = await departmentModel.findById(department);
  if (!departmentExists) {
    res.status(400);
    throw new Error("Department not found with the provided ID.");
  }


  const employeeId = await generateUniqueEmployeeId();
  

  const employee = await employeeModel.create({
    avatar,
    firstName,
    lastName,
    email,
    phoneNumber,
    documents,
    employeeId,
    dateOfBirth,
    maritalStatus,
    gender,
    nationality,
    address,
    city,
    state,
    department,
    joinDate,
    roleType,
    jobStatus
  });

  res.status(201).json({
    status: "success",
    message: "Employee added successfully",
    data: employee,
  });
});






  
const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // Extract `_id` from URL params
  
  // Validate `_id` format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid employee ID.");
  }
  
  // Fetch the employee by `_id` and populate the department field
  const employee = await employeeModel.findById(id).populate({
    path: 'department',
    select: '_id name' // Only select the fields you need from department
  });
  
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found.");
  }
  
  // Use the sendSuccessResponse utility for consistency
  sendSuccessResponse(res, "Employee retrieved successfully", {
    data: employee
  });
});



// get all employees
const getEmployees = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  // Fetch paginated employees
  const result = await paginateQuery(
    employeeModel,
    {},
    page,
    pageSize
  );
  
  // Populate department information for each employee
  await Promise.all(
    result.data.map(async (employee) => {
      if (employee.department) {
        await employee.populate('department');
      }
      return employee;
    })
  );

  // Map the result to include department name and ID
  const employees = result.data.map((employee) => ({
    id: employee.id,
    avatar: employee.avatar,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    department: employee.department 
      ? {
          id: employee.department._id,
          name: employee.department.name,
        } 
      : null,
    employeeId: employee.employeeId,
    roleType: employee.roleType,
    jobStatus: employee.jobStatus,
  }));

  // Respond with data and pagination info
  sendSuccessResponse(res, "Employees retrieved successfully", {
    employees,
    pagination: {
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      pageSize: result.pageSize,
      hasPrev: result.hasPrev,
      hasNext: result.hasNext,
    },
  });
});


const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // Extract `_id` from URL params
  const updateData = req.body; // Get update fields from request body

  // Validate `_id` format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid employee ID.");
  }

  // Check if the employee exists
  const employee = await employeeModel.findById(id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found.");
  }

  // Prevent updating employeeId
  if (updateData.employeeId && updateData.employeeId !== employee.employeeId) {
    res.status(400);
    throw new Error("Employee ID cannot be changed.");
  }

  // Check for duplicate email (excluding current employee)
  if (updateData.email) {
    const existingEmail = await employeeModel.findOne({
      email: updateData.email,
      _id: { $ne: id },
    });
    if (existingEmail) {
      res.status(400);
      throw new Error("An employee with this email already exists.");
    }
  }

  // Check for duplicate phone number (excluding current employee)
  if (updateData.phoneNumber) {
    const existingPhoneNumber = await employeeModel.findOne({
      phoneNumber: updateData.phoneNumber,
      _id: { $ne: id },
    });
    if (existingPhoneNumber) {
      res.status(400);
      throw new Error("An employee with this phone number already exists.");
    }
  }

  // Format dates if provided
  if (updateData.dateOfBirth) {
    updateData.dateOfBirth = validateAndFormatDate(updateData.dateOfBirth);
  }
  if (updateData.joinDate) {
    updateData.joinDate = validateAndFormatDate(updateData.joinDate);
  }

  // Update the employee with the provided data
  const updatedEmployee = await employeeModel.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true } // Return updated document and apply schema validation
  );

  // Respond with success
  res.status(200).json({
    status: "success",
    message: "Employee updated successfully",
    data: updatedEmployee,
  });
});

export { addEmployee, getEmployees, updateEmployee, getEmployeeById };
