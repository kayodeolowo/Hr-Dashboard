import mongoose, { Schema, Document } from "mongoose";
import { EmployeeTypes } from "../interface/employee.interface";

const employeeSchema: Schema = new Schema(
  {
    avatar: {
      type: String,
    },

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

    employeeId: { type: String, unique: true },

    employeeWorkEmail: { type: String, unique: true },

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

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department ID is required"],
    },

    jobStatus: {
      type: String,
      required: [true, "Job Status is required"],
      enum: ["Permanent", "Contract"],
    },

    roleType: {
      type: String,
      required: [true, "Role Type is required"],
      enum: ["Onsite", "Hybrid", "Remote"],
    },

    joinDate: {
      type: Date,
      required: [true, "Date of Joining is required"],
    },

    documents: {
      type: [String], // Array of strings to store the URLs
      default: [], // Default to an empty array if no documents are provided
    },

    attendance: [
      {
        // Define attendance as an array of objects
        date: { type: Date, required: true },
        checkInTime: { type: Date, required: true },
        checkOutTime: { type: Date, required: true },
        workingHours: {
          type: Number,
          required: true, // Include the working hours as a required field
        },
        status: {
          type: String,
          enum: ["On time", "Late"], // Only allow these two values for status
          required: true, // Include status as a required field
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
const employeeModel = mongoose.model<EmployeeTypes>("Employee", employeeSchema);

export default employeeModel;
