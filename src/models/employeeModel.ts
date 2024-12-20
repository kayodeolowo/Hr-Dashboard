import mongoose, { Schema, Document } from 'mongoose';
import { EmployeeTypes } from './Types';

// Define the interface for the User model


// Create the Mongoose schema
const employeeSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    maritalStatus: {
      type: String,
      required: [true, "Marital status is required"],
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    
    department: {
        type: String,
        required: [true, "Department is required"],
        enum: ["IT", "Engineering", "Design"],
      },
    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const employeeModel = mongoose.model<EmployeeTypes>("Employee", employeeSchema);

export default employeeModel;
