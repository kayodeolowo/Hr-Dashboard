// Import the Winston logger
import winston from 'winston';
import morgan from 'morgan';

// Define custom colors for log levels
const colors: { [key: string]: string } = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'orange',
};

// Add colors to Winston
winston.addColors(colors);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Create Winston logger instance
const logger = winston.createLogger({
  level: 'debug', // Default log level
  levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }), // Apply color to all log levels
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), // Add timestamp
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`), // Custom log format
  ),
  transports: [new winston.transports.Console()], // Log to console
});

// Morgan stream to pipe HTTP request logs into Winston
const handleLogs: morgan.StreamOptions = {
  write: (log: string) => {
    logger.http(log.trim());
  },
};

// Set up Morgan middleware to log HTTP requests
const logan = morgan(
  ':method :url :status :res[content-length] - :response-time ms', // Custom log format for HTTP requests
  { stream: handleLogs }
);

// Function to log errors with a stack trace
const logErrorToConsole = (err: Error) => {
  logger.error('AN ERROR OCCURRED WITH STACK TRACE:');
  logger.error(err.stack || err.message);
};

// General log function for info level
const log = (message: string) => {
  logger.info(message);
};

// Export the full logger
export default { logger, logan, logErrorToConsole, log };
