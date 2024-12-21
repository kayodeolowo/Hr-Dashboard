import employeeModel from "../models/employeeModel";

export const generateUniqueEmployeeId = async (): Promise<string> => {
  let uniqueId = "";
  let isUnique = false;

  while (!isUnique) {
    uniqueId = Math.floor(10000000 + Math.random() * 90000000).toString(); // Generate 8-digit number
    const existingEmployee = await employeeModel.findOne({ employeeId: uniqueId });
    if (!existingEmployee) {
      isUnique = true; // Confirm ID is unique
    }
  }

  return uniqueId;
};
