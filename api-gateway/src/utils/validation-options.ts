import {
  ValidationPipeOptions,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

const exceptionFactory = (errors: ValidationError[]) => {
  const errorSummary: { [property: string]: string } = {};

  const flattenErrors = (error: ValidationError, parentProperty = '') => {
    if (error.children && error.children.length > 0) {
      error.children.forEach((childError) => {
        flattenErrors(childError, parentProperty + error.property + '.');
      });
    } else {
      const constraints = error.constraints;
      if (constraints) {
        const property = parentProperty + error.property;
        const messages = Object.values(constraints);
        const summary = messages.join('; ');
        if (errorSummary[property]) {
          errorSummary[property] += '; ' + summary;
        } else {
          errorSummary[property] = summary;
        }
      }
    }
  };

  errors.forEach((error) => {
    flattenErrors(error);
  });

  const errorResponse = {};

  Object.keys(errorSummary).forEach((property) => {
    errorResponse[property] = errorSummary[property];
  });

  throw new HttpException(
    { status: HttpStatus.UNPROCESSABLE_ENTITY, errors: errorResponse },
    HttpStatus.UNPROCESSABLE_ENTITY,
  );
};

export const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => exceptionFactory(errors),
};
