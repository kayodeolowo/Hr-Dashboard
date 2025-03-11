import moment from "moment"; 

export const validateAndFormatDate = (date: string): Date => {
  // Check if date is provided and is a valid string
  if (!date || typeof date !== "string") {
    throw new Error("Date is required and must be a string.");
  }

  // Validate date format (DD-MM-YYYY)
  if (!moment(date, "DD-MM-YYYY", true).isValid()) {
    throw new Error("Invalid date format. Please use 'DD-MM-YYYY'.");
  }

  // Convert to Date object
  return moment(date, "DD-MM-YYYY").toDate();
};
