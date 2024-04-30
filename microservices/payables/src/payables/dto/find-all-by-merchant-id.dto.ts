export class SummaryByMerchantId {
  merchantId: string;
  filters?: {
    betweenDates?: {
      startDate: string;
      endDate: string;
    };
  };
}
