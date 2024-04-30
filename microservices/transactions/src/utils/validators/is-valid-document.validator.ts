import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { validateCPF } from './functions';

@Injectable()
@ValidatorConstraint({ name: 'IsValidDocument', async: true })
export class IsValidDocument implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value || value.toString().length !== 11) {
      return false;
    }

    return validateCPF(value.toString());
  }
}
