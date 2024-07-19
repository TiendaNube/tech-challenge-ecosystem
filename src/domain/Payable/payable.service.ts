import { Injectable } from '@nestjs/common'
import { addDays } from 'date-fns'
import { PaymentMethod, Transaction } from '../Transaction/transaction'
import { toCurrency } from '../../commons/utils'
import { Payable, PayableStatus } from './payable'
import { CREDIT_CARD_FEE, DEBIT_CARD_FEE } from './fee.constants'

@Injectable()
export class PayableService {
  async createPayableFromTransaction(transaction: Transaction) : Promise<Payable> {
    const payableSetupsByPaymentMethod = {
      [PaymentMethod.DEBIT_CARD]: this.setupPayableFromDebitTransaction(transaction),
      [PaymentMethod.CREDIT_CARD]: this.setupPayableFromCreditTransaction(transaction),
    }

    const newPayable = payableSetupsByPaymentMethod[transaction.paymentMethod]
    newPayable.merchantId = transaction.merchantId
    newPayable.subtotal = toCurrency(transaction.value)
    newPayable.total = toCurrency(newPayable.subtotal - newPayable.discount)
    return newPayable
  }

  private setupPayableFromDebitTransaction(transaction: Transaction) : Payable {
    const newPayable = new Payable()
    newPayable.status = PayableStatus.PAID
    newPayable.date = new Date()
    newPayable.discount = toCurrency(transaction.value * DEBIT_CARD_FEE)
    return newPayable
  }

  private setupPayableFromCreditTransaction(transaction: Transaction) : Payable {
    const newPayable = new Payable()
    newPayable.status = PayableStatus.WAITING_FUNDS
    newPayable.date = addDays(new Date(), 30)
    newPayable.discount = toCurrency(transaction.value * CREDIT_CARD_FEE)
    return newPayable
  }
}
