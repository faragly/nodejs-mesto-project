import expressWinston from 'express-winston';
import path from 'node:path';
import winston from 'winston';

const logDir = path.join(__dirname, '../logs');

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'request.log'),
    }),
  ],
});

export const errorLogger = expressWinston.errorLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
    }),
  ],
});
