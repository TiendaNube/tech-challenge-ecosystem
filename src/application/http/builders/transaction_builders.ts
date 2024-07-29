import { NewPayableType } from "../../../domain/entities/payable";
import { TransactionType } from "../../../domain/entities/transaction";

export function buildTransactionData(bodyData: any): TransactionType {
  const transactionData = {
    merchantId: bodyData.merchantId,
    description: bodyData.description,
    cardExpirationDate: bodyData.cardExpirationDate,
    cardHolder: bodyData.cardHolder,
    cardNumber: bodyData.cardNumber,
    cardCVV: bodyData.cardCVV,
    paymentMethod: bodyData.paymentMethod,
  };

  return transactionData;
}

export function buildPayableData(
  bodyData: any,
  transaction: TransactionType
): NewPayableType {
  const payable = {
    merchantId: bodyData.merchantId,
    subtotal: bodyData.subtotal,
    paymentMethod: transaction.paymentMethod,
  };

  return payable;
}
