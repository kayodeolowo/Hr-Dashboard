import { Response } from "express";

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
}

export const sendErrorResponse = (
  res: Response,
  message: string,
  errors?: any,
  statusCode: number = 400
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  } as ErrorResponse);
};
