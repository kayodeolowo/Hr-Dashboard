import { Request, Response, NextFunction } from 'express';
import { constants } from '../utils/constants';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode: number = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        success: false,
        title: 'Validation failed',
        message: err.message,
        // stackTrace: err.stack,
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        success: false,
        title: 'Not found',
        message: err.message,
        // stackTrace: err.stack,
      });
      break;

    case constants.UNAUTHORIZED:
      res.json({
        success: false,
        title: 'Unauthorized',
        message: err.message,
        // stackTrace: err.stack,
      });
      break;

    case constants.FORBIDDEN:
      res.json({
        success: false,
        title: 'Forbidden',
        message: err.message,
        // stackTrace: err.stack,
      });
      break;

    case constants.SERVER_ERROR:
      res.json({
        success: false,
        title: 'Server Error',
        message: err.message,
        // stackTrace: err.stack,
      });
      break;

    default:
      res.json({
        success: false,
        title: 'Error',
        message: err.message,
        // stackTrace: err.stack,
      });
      break;
  }
};

export default errorHandler;
