import { Payable, PayableStatus } from '@domain/entities/payable.entity';
import {
    ICalculatePayableResponse,
    IPaymentStrategy,
} from './payment-strategy';
import { addDays } from 'date-fns';

export class DebitCardStrategy implements IPaymentStrategy {
    calculatePayable(total: number): ICalculatePayableResponse {
        const fee = 0.02; // 2%
        const discount = total * fee;
        const subTotal = total - discount;
        const daysToAdd = 0;
        return {
            subTotal,
            discount,
            daysToAdd,
            status: PayableStatus.PAID,
        };
    }
}
