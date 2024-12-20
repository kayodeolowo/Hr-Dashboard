import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import employeeModel from "../models/employeeModel";

// Add a new Employee
const addEmployee = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,lastName,email,phoneNumber,dateOfBirth,maritalStatus,gender,nationality,address,city,state,department,
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
  

  // Create a new employee
  const employee = await employeeModel.create({firstName,lastName,email,phoneNumber,dateOfBirth,maritalStatus,gender,nationality,address,city,state,department
  });

  // Respond with success
  res.status(201).json({
    status: "success",
    message: "Employee added successfully",
    data: employee,
  });
});

export { addEmployee };
