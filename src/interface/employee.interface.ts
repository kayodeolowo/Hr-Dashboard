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
  city: string;
  state: string;
  department: string;
  employeeId: string;
  documents: string[];
  attendance: Attendance[]; 
}
