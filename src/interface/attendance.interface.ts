import mongoose, {  Document } from "mongoose";

// Define the Attendance schema
export interface AttendanceDocument extends Document {
  employeeId: mongoose.Types.ObjectId; // Reference to employee
  date: Date;
  checkInTime: Date;
  checkOutTime: Date;
  workingHours: number;
  status: string;
}