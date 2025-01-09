import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import employeeModel from "../models/employeeModel";
import mongoose from "mongoose";
import attendanceModel from "../models/attendanceModel"
import { paginateQuery } from '../helpers/paginate';
import { sendSuccessResponse } from "../utils/sendSuccessResponse";

// Helper function to validate and convert time strings like '07:00' or '22:00'
const validateAndParseTime = (time: string) => {
  const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time); // HH:mm format validation
  if (!isValidTime) {
    throw new Error("Time must be in HH:mm format.");
  }
  return time;
};

// Add attendance for a specific employee by using their _id
const addAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { date, checkInTime, checkOutTime, employeeId } = req.body;

  // Validate required fields
  if (!date || !checkInTime || !checkOutTime || !employeeId) {
    res.status(400);
    throw new Error("Date, check-in time, check-out time, and employee ID are required.");
  }

  // Validate employee id format
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

  // Validate and format time strings
  const checkInFormatted = validateAndParseTime(checkInTime);
  const checkOutFormatted = validateAndParseTime(checkOutTime);

  // Check if the selected date is today's date
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = new Date(date).toISOString().split("T")[0];
  if (selectedDate !== today) {
    res.status(400);
    throw new Error("Only today's date is allowed.");
  }

  // Convert check-in and check-out times to Date objects
  const checkIn = new Date(`${date}T${checkInFormatted}:00Z`);
  let checkOut = new Date(`${date}T${checkOutFormatted}:00Z`);

  // Check if check-in time is after 9:00 AM (late check-in)
  const nineAM = new Date(`${date}T09:00:00Z`);
  const fivePM = new Date(`${date}T17:00:00Z`);

  // If check-in is after 9:00 AM, mark as late
  const isLate = checkIn > nineAM;

  // Ensure check-out time doesn't exceed 5:00 PM
  if (checkOut > fivePM) {
    checkOut = fivePM;
  }

  // Check that check-out time is greater than check-in time
  if (checkOut <= checkIn) {
    res.status(400);
    throw new Error("Check-out time must be greater than check-in time.");
  }

  // Calculate working hours
  const workingHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);

  // Determine the attendance status
  const status = isLate ? "Late" : workingHours >= 8 ? "On time" : "Late";

  // Create attendance data
  const attendanceData = {
    employeeId: employee._id,
    date,
    checkInTime: checkIn,
    checkOutTime: checkOut,
    workingHours,
    status,
  };

  // Save the attendance data
  const newAttendance = await attendanceModel.create(attendanceData);

  sendSuccessResponse(res, "Attendance added successfully", {
    data: newAttendance,
  });
});
  



  const getAllAttendance = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
  
    // Use the paginateQuery helper to get paginated results
    const paginatedAttendance = await paginateQuery(attendanceModel, {}, page, pageSize);
  
    if (paginatedAttendance.data.length === 0) {
      res.status(404);
      throw new Error("No attendance records found.");
    }
  
    // Respond with paginated attendance records
    sendSuccessResponse(res, "Attendance records retrieved successfully", {
      data: paginatedAttendance.data,
      totalItems: paginatedAttendance.totalItems,
      totalPages: paginatedAttendance.totalPages,
      currentPage: paginatedAttendance.currentPage,
     
    });
  });
  

  

  const getEmployeeAttendance = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params; // Get the employee ID from the URL
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
  
    // Validate employee ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid employee ID.");
    }
  
    // Use the paginateQuery helper to get paginated results for the employee's attendance
    const paginatedAttendance = await paginateQuery(attendanceModel, { employeeId: id }, page, pageSize);
  
    if (paginatedAttendance.data.length === 0) {
      res.status(404);
      throw new Error("No attendance records found for this employee.");
    }
  
    // Respond with paginated employee's attendance records
    sendSuccessResponse(res, "Attendance record retrieved successfully", {
      data: paginatedAttendance.data,
      totalItems: paginatedAttendance.totalItems,
      totalPages: paginatedAttendance.totalPages,
      currentPage: paginatedAttendance.currentPage
      
    });
  });
  
  
  

// // Get all attendance records for a specific employee
// const getEmployeeAttendance = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params; // Get employee id from the URL

//   // Validate employee id format
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     res.status(400);
//     throw new Error("Invalid employee ID.");
//   }

//   // Find the employee by _id and select the attendance field
//   const employee = await employeeModel.findById(id).select("attendance");
//   if (!employee) {
//     res.status(404);
//     throw new Error("Employee not found.");
//   }

//   // Respond with the attendance data
//   res.status(200).json({
//     status: "success",
//     message: "Employee attendance retrieved successfully",
//     data: employee.attendance,
//   });
// });

export { addAttendance, getAllAttendance, getEmployeeAttendance };
