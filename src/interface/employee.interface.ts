import { Document } from "mongoose";

interface Attendance {
  date: Date;
  checkInTime: Date;
  checkOutTime: Date;
}


export interface EmployeeTypes extends Document {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  roleType: string
  phoneNumber: string;
  dateOfBirth: Date;
  jobStatus: string;
  maritalStatus: string;
  gender: string;
  nationality: string;
  address: string;
  state: string;
  department?: { _id: string; name: string } | null;
  employeeId: string;
  employeeWorkEmail: string;
  documents: string[];
  attendance: Attendance[]; 
}
