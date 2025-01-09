import mongoose, { Schema, Document } from "mongoose";

// Define the Project schema
export interface ProjectDocument extends Document {
  projectName: string;
  startDate: Date;
  finishDate: Date;
  status: "Completed" | "In progress";
  employeeId: mongoose.Types.ObjectId; 
}