import { Response } from 'express';

interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const sendSuccessResponse = (
  res: Response,
  message: string,
  data?: any,
  statusCode: number = 200
): void => {
  if (statusCode === 201) {
    res.status(201).json({
      success: true,
      message,
      data,
    } as SuccessResponse);
  } else {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    } as SuccessResponse);
  }
};
