import { TransactionPaymentMethod } from '@domain/entities/transaction.entity';

export class CreateTransactionDto {
    totalValue: number;
    description: string;
    paymentMethod: TransactionPaymentMethod;
    cardNumber: string; // last 4 numbers
    cardHolder: string;
    cardExpirationDate: Date;
    cardCvv: string;
    merchantId: string;
}
