import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import employeeModel from "../models/employeeModel";
import { buildFilter } from "../helpers/filter";
import { paginateQuery } from "../helpers/paginate";
import moment from "moment";
import { validateAndFormatDate } from "../helpers/dateValidator";
import { generateUniqueEmployeeId } from "../helpers/uniqueEmployeeId";




// Add a new Employee
const addEmployee = asyncHandler(async (req: Request, res: Response) => {
  const {
    avatar ,firstName,lastName,email,phoneNumber,dateOfBirth, documents, maritalStatus,gender,nationality,address,city,state,department, joinDate, roleType
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
  const employee = await employeeModel.create({avatar ,firstName,lastName,email,phoneNumber, documents, employeeId, dateOfBirth: formattedDateOfBirth,maritalStatus,gender,nationality,address,city,state,department, joinDate: formattedJoinDate, roleType
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
  
    // Fetch paginated and filtered employees
    const result = await paginateQuery(employeeModel, filter, page, pageSize);
  
    // Respond with data and pagination info
    res.status(200).json({
      status: "success",
      message: "Employees retrieved successfully",
      data: result.data,
      pagination: {
        totalItems: result.totalItems,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      },
    });
  });

export { addEmployee, getEmployees };
