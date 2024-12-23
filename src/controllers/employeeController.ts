import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import employeeModel from "../models/employeeModel";
import { buildFilter } from "../helpers/filter";
import { paginateQuery } from "../helpers/paginate";
import { validateAndFormatDate } from "../helpers/dateValidator";
import { generateUniqueEmployeeId } from "../helpers/uniqueEmployeeId";
import mongoose from "mongoose";

// Add a new Employee
const addEmployee = asyncHandler(async (req: Request, res: Response) => {
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
  } = req.body;

  // Check for duplicate email
  const existingEmployee = await employeeModel.findOne({ email });
  if (existingEmployee) {
    res.status(400);
    throw new Error("An employee with this email already exists.");
  }

  // Check for duplicate phone number
  const existingPhoneNumber = await employeeModel.findOne({ phoneNumber });
  if (existingPhoneNumber) {
    res.status(400);
    throw new Error("An employee with this phone number already exists.");
  }

  const employeeId = await generateUniqueEmployeeId();
  const formattedDateOfBirth = validateAndFormatDate(dateOfBirth);
  const formattedJoinDate = validateAndFormatDate(joinDate);

  // Create a new employee
  const employee = await employeeModel.create({
    avatar,
    firstName,
    lastName,
    email,
    phoneNumber,
    documents,
    employeeId,
    dateOfBirth: formattedDateOfBirth,
    maritalStatus,
    gender,
    nationality,
    address,
    city,
    state,
    department,
    joinDate: formattedJoinDate,
    roleType,
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    message: "Employee added successfully",
    data: employee,
  });
});

const getEmployees = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  // Build filter based on allowed fields (e.g., department)
  const filterFields = ["department"];
  const filter = buildFilter(req.query, filterFields);

  // Initialize a variable to store total employees in the filtered department
  let totalInDepartment = null;

  // Check if the department filter is applied
  if (filter.department) {
    totalInDepartment = await employeeModel.countDocuments({ department: filter.department });
  }

  // Fetch paginated and filtered employees with only the required fields
  const result = await paginateQuery(employeeModel, filter, page, pageSize);

  // Map the result to return only the specified fields
  const employees = result.data.map((employee) => ({
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    department: employee.department,
  }));

  // Structure the response with the department name as the key
  const data = filter.department
    ? {
      totalInDepartment,
        [filter.department]: employees
        
      }
    : { employees };

  // Respond with data, pagination info, and total employees in the department (if filtered)
  res.status(200).json({
    status: "success",
    message: "Employees retrieved successfully",
    data,
    pagination: {
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    },
  });
});


  

const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // Extract `_id` from URL params

  // Validate `_id` format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid employee ID.");
  }

  // Fetch the employee by `_id`
  const employee = await employeeModel.findById(id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found.");
  }

  // Respond with the employee data
  res.status(200).json({
    status: "success",
    message: "Employee retrieved successfully",
    data: employee,
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
