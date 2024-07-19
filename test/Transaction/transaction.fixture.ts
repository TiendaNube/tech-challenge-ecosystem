import { TransactionDTO } from '../../src/domain/Transaction/transaction.dto'
import { PaymentMethod, Transaction } from '../../src/domain/Transaction/transaction'

export const buildTransactionDTO = (paymentMethod = PaymentMethod.CREDIT_CARD) => {
  const transactionDTO = new TransactionDTO()
  transactionDTO.merchantId = 1
  transactionDTO.description = 'test'
  transactionDTO.value = 100.50
  transactionDTO.paymentMethod = paymentMethod
  transactionDTO.cardCVV = 123
  transactionDTO.cardHolder = '123'
  transactionDTO.cardExpirationDate = new Date()
  transactionDTO.cardNumber = '1234'
  return transactionDTO
}

export const buildCreditCardTransaction = () => {
  const creditCradTransaction = new Transaction()
  creditCradTransaction.merchantId = 1
  creditCradTransaction.description = 'test'
  creditCradTransaction.value = 100.50
  creditCradTransaction.paymentMethod = PaymentMethod.CREDIT_CARD
  return creditCradTransaction
}

export const buildDebitCardTransaction = () => {
  const debitCradTransaction = new Transaction()
  debitCradTransaction.merchantId = 2
  debitCradTransaction.description = 'test2'
  debitCradTransaction.value = 200.50
  debitCradTransaction.paymentMethod = PaymentMethod.DEBIT_CARD
  return debitCradTransaction
}
