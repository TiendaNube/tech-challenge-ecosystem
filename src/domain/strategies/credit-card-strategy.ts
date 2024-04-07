import { PayableStatus } from '@domain/entities/payable.entity';
import {
    ICalculatePayableResponse,
    IPaymentStrategy,
} from './payment-strategy';

export class CreditCardStrategy implements IPaymentStrategy {
    calculatePayable(total: number): ICalculatePayableResponse {
        const fee = parseFloat(process.env.CREDIT_CARD_FEE) ?? 0.04; //4%
        console.log(fee);
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
