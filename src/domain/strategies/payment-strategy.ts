import { Payable, PayableStatus } from '@domain/entities/payable.entity';

export interface ICalculatePayableResponse {
    subTotal: number;
    discount: number;
    daysToAdd: number;
    status: PayableStatus;
}

export interface IPaymentStrategy {
    calculatePayable(total: number): ICalculatePayableResponse;
}
