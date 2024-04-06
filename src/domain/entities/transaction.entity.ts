export enum TransactionPaymentMethod {
    'debit_card',
    'credit_card',
}

export class Transaction {
    id: string;
    merchantId: string;
    description: string;
    paymentMethod: TransactionPaymentMethod;
    cardHolder: string;
    cardNumber: string; //Last 4 digits
    cardExpirationDate: Date;
    cardCvv: string;
}
