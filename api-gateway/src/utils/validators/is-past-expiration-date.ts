import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { parse, isAfter } from 'date-fns';

@Injectable()
@ValidatorConstraint({ name: 'IsPastExpirationDate', async: true })
export class IsPastExpirationDate implements ValidatorConstraintInterface {
  validate(value: string) {
    const splitDate = value.split('/');

    if (splitDate.length > 2 || splitDate.length === 0) {
      return false;
    }

    const parsedExpirationDate = parse(value, 'MM/yyyy', new Date());
    const currentDate = new Date();

    return isAfter(parsedExpirationDate, currentDate);
  }
}
