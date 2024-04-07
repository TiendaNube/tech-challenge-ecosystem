import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { EndDateGreaterThanStartDateConstraint } from './validators/end-date-greater-than-start-date-constraint';

export class PayableValidatedSummaryFiltersDto {
    @IsNotEmpty()
    @IsString()
    merchantId: string;

    @IsOptional()
    @IsDateString()
    startDate: Date;

    @IsOptional()
    @IsDateString()
    @Validate(EndDateGreaterThanStartDateConstraint)
    endDate: Date;
}
