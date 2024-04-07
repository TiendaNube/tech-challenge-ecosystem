import { PayableStatus } from '@domain/entities/payable.entity';
import {
    ICalculatePayableResponse,
    IPaymentStrategy,
} from './payment-strategy';

export class DebitCardStrategy implements IPaymentStrategy {
    calculatePayable(total: number): ICalculatePayableResponse {
        const fee = parseFloat(process.env.DEBIT_CARD_FEE) ?? 0.02; // 2%
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
