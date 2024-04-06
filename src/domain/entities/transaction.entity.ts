import { IPaymentStrategy } from '@domain/strategies/payment-strategy';
import { Payable } from './payable.entity';
import { DebitCardStrategy } from '@domain/strategies/debit-card-strategy';
import { CreditCardStrategy } from '@domain/strategies/credit-card-strategy';
import { plainToInstance } from 'class-transformer';
import { addDays } from 'date-fns';

export enum TransactionPaymentMethod {
    DEBIT_CARD = 'debit_card',
    CREDIT_CARD = 'credit_card',
}

const paymentStrategyMap = new Map<TransactionPaymentMethod, IPaymentStrategy>([
    [TransactionPaymentMethod.DEBIT_CARD, new DebitCardStrategy()],
    [TransactionPaymentMethod.CREDIT_CARD, new CreditCardStrategy()],
]);

export class Transaction {
    id: string;
    merchantId: string;
    totalValue: number;
    description: string;
    paymentMethod: TransactionPaymentMethod;
    cardHolder: string;
    cardNumber: string; //Last 4 digits
    cardExpirationDate: Date;
    cardCvv: string;

    generatePayable(): Payable {
        const { subTotal, discount, status, daysToAdd } = paymentStrategyMap
            .get(this.paymentMethod)
            .calculatePayable(this.totalValue);
        return plainToInstance(Payable, {
            merchantId: this.merchantId,
            cardExpirationDate: this.cardExpirationDate,
            total: this.totalValue,
            subTotal,
            discount,
            status,
            createdDate: addDays(new Date(), daysToAdd),
        });
    }
}
