import { PayableSummaryFiltersDto } from '../dtos/payable-summary-filters.dto';
import { PayableSummaryDto } from '../dtos/payable-summary.dto';

export interface IPayableController {
    getSummaryPayables(
        filters: PayableSummaryFiltersDto,
    ): Promise<PayableSummaryDto>;
}
