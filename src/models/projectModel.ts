import mongoose, { Schema, Document } from "mongoose";

// Define the Project schema
interface ProjectDocument extends Document {
  projectName: string;
  startDate: Date;
  finishDate: Date;
  status: "Completed" | "In progress";
  employeeId: mongoose.Types.ObjectId; 
}


const projectSchema = new Schema<ProjectDocument>({
  projectName: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
  status: { type: String, enum: ["Completed", "In progress"], required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, 
});

const projectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default projectModel;
