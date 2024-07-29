export class PayablesTotalDto {
    constructor(partial: Partial<PayablesTotalDto>) {
        Object.assign(this, partial);
    }

    totalPaid: number;
    totalDiscounts: number;
    totalWaitingFunds: number;
}
