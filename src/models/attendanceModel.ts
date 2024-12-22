import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Attendance document
interface IAttendance extends Document {
  date: Date;
  checkInTime: Date;
  checkOutTime: Date;
  id: mongoose.Schema.Types.ObjectId; // Assuming you're linking it to an employee
}

// Define the schema for the Attendance model
const attendanceSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', // Referencing Employee model (adjust if using different model)
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt
  }
);

// Create the Attendance model
const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);

export default Attendance;
