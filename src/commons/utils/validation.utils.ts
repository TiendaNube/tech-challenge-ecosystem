import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidExpirationDateConstraint implements ValidatorConstraintInterface {
    validate(date: string) {
        const [month, year] = date.split('/').map(Number);

        if (!month || !year || month < 1 || month > 12) {
            return false;
        }
        return true;
    }

    defaultMessage() {
        return 'Card Expiration Date must be in MM/YYYY format and contain a valid month (01-12)';
    }
}

export function IsValidExpirationDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidExpirationDateConstraint,
        });
    };
}
