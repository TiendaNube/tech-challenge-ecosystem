import { TestingModule } from '@nestjs/testing'
import { addDays, format } from 'date-fns'
import { PayableService } from '../../src/domain/Payable/payable.service'
import { createModuleForUnitTest, defaultDateTimeFormat, toCurrency } from '../../src/commons/utils'
import { payableModuleMetadata } from '../../src/domain/Payable/payable.module'
import { CREDIT_CARD_FEE, DEBIT_CARD_FEE } from '../../src/domain/Payable/fee.constants'
import { buildCreditCardTransaction, buildDebitCardTransaction } from '../Transaction/transaction.fixture'
import { PayableStatus } from '../../src/domain/Payable/payable'

/**
 * @group unit
 */
describe('PayableService', () => {
  const creditCradTransaction = buildCreditCardTransaction()
  const debitCradTransaction = buildDebitCardTransaction()

  let payableService: PayableService
  let module: TestingModule
  beforeAll(async () => {
    module = await createModuleForUnitTest(payableModuleMetadata)
    payableService = module.get(PayableService)
  })

  it('should create a payable from a credit card transaction', async () => {
    const payable = await payableService.createPayableFromTransaction(creditCradTransaction)
    expect(payable.merchantId).toBe(creditCradTransaction.merchantId)
    expect(payable.status).toBe(PayableStatus.WAITING_FUNDS)
    expect(payable.subtotal).toBe(creditCradTransaction.value)
    expect(payable.discount).toBe(toCurrency(creditCradTransaction.value * CREDIT_CARD_FEE))
    expect(payable.total).toBe(toCurrency(creditCradTransaction.value - (creditCradTransaction.value * CREDIT_CARD_FEE)))
    expect(format(payable.date, defaultDateTimeFormat)).toBe(format(addDays(new Date(), 30), defaultDateTimeFormat))
  })

  it('should create a payable from a debit card transaction', async () => {
    const payable = await payableService.createPayableFromTransaction(debitCradTransaction)
    expect(payable.merchantId).toBe(debitCradTransaction.merchantId)
    expect(payable.status).toBe(PayableStatus.PAID)
    expect(payable.subtotal).toBe(debitCradTransaction.value)
    expect(payable.discount).toBe(toCurrency(debitCradTransaction.value * DEBIT_CARD_FEE))
    expect(payable.total).toBe(toCurrency(debitCradTransaction.value - (debitCradTransaction.value * DEBIT_CARD_FEE)))
    expect(format(payable.date, defaultDateTimeFormat)).toBe(format(new Date(), defaultDateTimeFormat))
  })
})
