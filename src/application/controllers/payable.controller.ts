import { GetSummaryPayablesUseCase } from '@domain/usecases/getSummaryPayables/get-summary-payables';
import { IPayableController } from './interfaces/payable-controller';
import { PayableSummaryFiltersDto } from './dtos/payable-summary-filters.dto';
import { PayableSummary } from '@domain/entities/payable-summary.entity';

export class PayableControllerImpl implements IPayableController {
    constructor(private getSummaryPayablesUseCase: GetSummaryPayablesUseCase) {}

    async getSummaryPayables(
        filters: PayableSummaryFiltersDto,
    ): Promise<PayableSummary> {
        return this.getSummaryPayablesUseCase.execute(filters);
    }
}
