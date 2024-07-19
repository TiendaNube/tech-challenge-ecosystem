import { TestingModule } from '@nestjs/testing'
import { addSeconds, subSeconds } from 'date-fns'
import { PaymentMethod, Transaction } from '../../src/domain/Transaction/transaction'
import { createModuleForIntegrationTest, toCurrency } from '../../src/commons/utils'
import { Payable, PayableStatus } from '../../src/domain/Payable/payable'
import { PayableService } from '../../src/domain/Payable/payable.service'
import { buildTransactionDTO } from '../Transaction/transaction.fixture'
import { PayableQueryParams } from '../../src/domain/Payable/payable.query-params'
import { transactionModuleMetadata } from '../../src/domain/Transaction/transaction.module'
import { TransactionService } from '../../src/domain/Transaction/transaction.service'

/**
 * @group integration
 */
describe('PayableService', () => {
  const debitCardTransactionDTO = buildTransactionDTO(PaymentMethod.DEBIT_CARD)
  const creditCardTransactionDTO = buildTransactionDTO(PaymentMethod.CREDIT_CARD)

  let payableService: PayableService
  let transactionService: TransactionService
  let module: TestingModule

  beforeAll(async () => {
    module = await createModuleForIntegrationTest(transactionModuleMetadata)
    payableService = module.get(PayableService)
    transactionService = module.get(TransactionService)
  })

  afterAll(async () => {
    module.close()
  })

  afterEach(async () => {
    await Payable.delete({})
    await Transaction.delete({})
  })

  it('should find a single payable totals', async () => {
    await transactionService.createTransaction(debitCardTransactionDTO)
    const payables = await Payable.find({})
    const payable = payables[0]

    const result = await payableService.getPayablesTotalsByMerchant({
      merchantId: debitCardTransactionDTO.merchantId,
      fromDate: payable.date,
      toDate: payable.date,
    } as PayableQueryParams)

    expect(result).toEqual({
      totalPaid: toCurrency(payable.total),
      totalPaidFees: toCurrency(payable.discount),
      totalToBeReceived: 0,
    })
  })

  it('should not find payables out of period range informed', async () => {
    await transactionService.createTransaction(debitCardTransactionDTO)
    const payables = await Payable.find({})
    const payable = payables[0]

    const result = await payableService.getPayablesTotalsByMerchant({
      merchantId: debitCardTransactionDTO.merchantId,
      fromDate: addSeconds(payable.date, 1),
      toDate: subSeconds(payable.date, 1),
    } as PayableQueryParams)

    expect(result).toEqual({
      totalPaid: 0,
      totalPaidFees: 0,
      totalToBeReceived: 0,
    })
  })

  it('should sum up all payables within a period range', async () => {
    await transactionService.createTransaction(debitCardTransactionDTO)
    await transactionService.createTransaction(creditCardTransactionDTO)
    const payables = await Payable.find({})

    const debitPayable = payables.find((p) => p.status === PayableStatus.PAID)!
    const futureCreditPayable = payables.find((p) => p.status === PayableStatus.WAITING_FUNDS)!

    const result = await payableService.getPayablesTotalsByMerchant({
      merchantId: debitCardTransactionDTO.merchantId,
      fromDate: debitPayable.date,
      toDate: futureCreditPayable.date,
    } as PayableQueryParams)

    expect(result).toEqual({
      totalPaid: toCurrency(debitPayable.total),
      totalPaidFees: toCurrency(debitPayable.discount),
      totalToBeReceived: toCurrency(futureCreditPayable.total),
    })
  })
})
