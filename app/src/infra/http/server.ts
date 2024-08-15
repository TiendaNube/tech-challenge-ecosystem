import 'dotenv/config';
import '../../setup';

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import AppError from '@errors/AppError';
import httpStatus from 'http-status';

import '@container/index';

import routes from './routes';

import logger from '@infra/logger';

import { ValidationError } from 'yup';

const app = express();

const PORT = process.env.PORT || 3333;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, __: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  if (err instanceof ValidationError) {
    let message;

    if (err.errors && err.errors.length > 1) {
      message = JSON.stringify(err.errors);
    }

    return response
      .status(httpStatus.BAD_REQUEST)
      .json({ status: 'error', message: message || err.message });
  }

  logger.error(err.message);

  return response
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ status: 'error', message: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server started at port ${PORT}`);
  });
}

export { app };
