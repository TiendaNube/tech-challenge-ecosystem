import { PayableStatus } from '@domain/entities/payable.entity';
import {
    ICalculatePayableResponse,
    IPaymentStrategy,
} from './payment-strategy';

export class CreditCardStrategy implements IPaymentStrategy {
    calculatePayable(total: number): ICalculatePayableResponse {
        const fee = 0.04; //4%
        const discount = total * fee;
        const subTotal = total - discount;
        const daysToAdd = 30;
        return {
            subTotal,
            discount,
            daysToAdd,
            status: PayableStatus.WAIT_FUNDS,
        };
    }
}
