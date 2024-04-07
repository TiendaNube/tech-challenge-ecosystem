import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { PayableValidatedSummaryFiltersDto } from '../payable-validated-summary-filters.dto';

@ValidatorConstraint({ name: 'endDateGreaterThanStartDate', async: false })
export class EndDateGreaterThanStartDateConstraint
    implements ValidatorConstraintInterface
{
    validate(value: any, args: ValidationArguments) {
        const { startDate } = args.object as PayableValidatedSummaryFiltersDto;
        if (!startDate || !value) {
            return true; // Validation passes if either startDate or endDate is not provided
        }
        return value > startDate; // Validation passes if endDate is greater than startDate
    }

    defaultMessage(args: ValidationArguments) {
        return 'End date must be greater than start date';
    }
}
