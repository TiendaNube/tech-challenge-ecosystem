import { PayableSummaryFiltersDto } from '@application/controllers/dtos/payable-summary-filters.dto';
import { IPayableController } from '@application/controllers/interfaces/payable-controller';
import { PayableSummary } from '@domain/entities/payable-summary.entity';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { PAYABLE_CONTROLLER } from '../helpers/constants';
import { PayableValidatedSummaryFiltersDto } from './dtos/payable-validated-summary-filters.dto';

@Controller('payables')
export class PayableController {
    constructor(
        @Inject(PAYABLE_CONTROLLER)
        private readonly payableController: IPayableController,
    ) {}

    @Get('/summary')
    getSummaryPayables(
        @Query()
        filters: PayableValidatedSummaryFiltersDto,
    ): Promise<PayableSummary> {
        return this.payableController.getSummaryPayables(filters);
    }
}
