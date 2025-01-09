import moment from "moment"; 

export const validateAndFormatDate = (date: string): Date => {
  // Check if date is provided and is a valid string
  if (!date || typeof date !== 'string') {
    throw new Error("Date is required and must be a string.");
  }

  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid date format. Please use 'YYYY-MM-DD'.");
  }
  return moment(date, "YYYY-MM-DD").toDate();
};
