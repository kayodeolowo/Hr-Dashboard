import mongoose, { Schema } from "mongoose";
import { ProjectDocument } from "interface/project.interface.types";



const projectSchema = new Schema<ProjectDocument>({
  projectName: { type: String, required: true },
  startDate: { type: Date, required: true },
  finishDate: { type: Date, required: true },
  status: { type: String, enum: ["Completed", "Pending", "In Progress"], required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, 
});

const projectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default projectModel;
