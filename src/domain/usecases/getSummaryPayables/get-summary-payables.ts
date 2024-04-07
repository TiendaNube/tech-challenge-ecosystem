import { PayableSummaryFiltersDto } from '@application/controllers/dtos/payable-summary-filters.dto';
import { PayableSummary } from '@domain/entities/payable-summary.entity';
import { IPayableRepository } from '@domain/interfaces/payable.repository';

export class GetSummaryPayablesUseCase {
    constructor(private payableRepository: IPayableRepository) {}
    async execute(filters: PayableSummaryFiltersDto): Promise<PayableSummary> {
        const { merchantId, startDate, endDate } = filters;
        return this.payableRepository.summaryByMerchantIdAndStartDateAndEndDate(
            merchantId,
            startDate,
            endDate,
        );
    }
}
