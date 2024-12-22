import mongoose, { Schema, Document } from "mongoose";

// Define the Attendance schema
interface AttendanceDocument extends Document {
  employeeId: mongoose.Types.ObjectId; // Reference to employee
  date: Date;
  checkInTime: Date;
  checkOutTime: Date;
  workingHours: number;
  status: string;
}

// Create the Attendance schema
const attendanceSchema = new Schema<AttendanceDocument>({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date, required: true },
  workingHours: { type: Number, required: true },
  status: { type: String, required: true },
});

const attendanceModel = mongoose.model<AttendanceDocument>("Attendance", attendanceSchema);
export default attendanceModel;
