import moment from "moment";

export const validateAndFormatDate = (date: string): Date => {
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid date format. Please use 'YYYY-MM-DD'.");
  }
  return moment(date, "YYYY-MM-DD").toDate();
};
