import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import employeeModel from "../models/employeeModel";
import mongoose from "mongoose";

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
  const { id } = req.params; // Get the employee id from the URL
  const { date, checkInTime, checkOutTime } = req.body; // Get attendance data from request body

  // Validate required fields
  if (!date || !checkInTime || !checkOutTime) {
    res.status(400);
    throw new Error("Date, check-in time, and check-out time are required.");
  }

  // Validate and format time strings
  const checkInFormatted = validateAndParseTime(checkInTime);
  const checkOutFormatted = validateAndParseTime(checkOutTime);

  // Check if the selected date is today's date
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const selectedDate = new Date(date).toISOString().split("T")[0]; // Convert selected date to YYYY-MM-DD format
  if (selectedDate !== today) {
    res.status(400);
    throw new Error("Only today's date is allowed.");
  }

  // Validate employee id format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid employee ID.");
  }

  // Find the employee by _id
  const employee = await employeeModel.findById(id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found.");
  }

  // Convert check-in and check-out times to Date objects by combining with the date
  const checkIn = new Date(`${date}T${checkInFormatted}:00Z`); // ISO format time
  let checkOut = new Date(`${date}T${checkOutFormatted}:00Z`);

  // Check if check-in time is after 9:00 AM (late check-in)
  const nineAM = new Date(`${date}T09:00:00Z`);
  const fivePM = new Date(`${date}T17:00:00Z`); // Define fixed 5:00 PM time

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

  // Calculate working hours by getting the difference between check-in and check-out times
  const workingHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60); // in hours

  // Determine the attendance status based on check-in time and working hours
  const status = isLate ? "Late" : workingHours >= 8 ? "On time" : "Late";

  // Create attendance data with status and working hours
  const attendanceData = {
    date,
    checkInTime: checkIn,  // Store as Date object
    checkOutTime: checkOut, // Store as Date object
    workingHours,          // Include working hours
    status,                // Include status (Late or On time)
  };

  // Add the attendance data to the employee's attendance array
  employee.attendance = employee.attendance ? [...employee.attendance, attendanceData] : [attendanceData];

  // Save the updated employee record
  await employee.save();

  // Respond with the added attendance data only (not the entire employee record)
  res.status(201).json({
    status: "success",
    message: "Attendance added successfully",
    data: attendanceData, // Return only the added attendance data
  });
});




  
  

// Get all attendance records for a specific employee
const getEmployeeAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params; // Get employee id from the URL

  // Validate employee id format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid employee ID.");
  }

  // Find the employee by _id and select the attendance field
  const employee = await employeeModel.findById(id).select("attendance");
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found.");
  }

  // Respond with the attendance data
  res.status(200).json({
    status: "success",
    message: "Employee attendance retrieved successfully",
    data: employee.attendance,
  });
});

export { addAttendance, getEmployeeAttendance };
