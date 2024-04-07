import { PayableSummary } from '@domain/entities/payable-summary.entity';

export interface IPayableRepository {
    summaryByMerchantIdAndStartDateAndEndDate(
        merchantId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<PayableSummary>;
}
