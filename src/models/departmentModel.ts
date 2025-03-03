import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const departmentModel = mongoose.model<IDepartment>('Department', departmentSchema);