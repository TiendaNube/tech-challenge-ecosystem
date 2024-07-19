import { TestingModule } from '@nestjs/testing'
import { Transaction } from '../../src/domain/Transaction/transaction'
import { createModuleForIntegrationTest } from '../../src/commons/utils'
import { TransactionService } from '../../src/domain/Transaction/transaction.service'
import { transactionModuleMetadata } from '../../src/domain/Transaction/transaction.module'
import { Payable } from '../../src/domain/Payable/payable'
import { PayableService } from '../../src/domain/Payable/payable.service'
import { buildTransactionDTO } from './transaction.fixture'

/**
 * @group integration
 */
describe('TransactionService', () => {
  const creditCradTransactionDTO = buildTransactionDTO()
  let transactionService: TransactionService
  let payableService: PayableService
  let module: TestingModule

  beforeAll(async () => {
    module = await createModuleForIntegrationTest(transactionModuleMetadata)
    transactionService = module.get(TransactionService)
    payableService = module.get(PayableService)
  })

  afterEach(async () => {
    await Payable.delete({})
    await Transaction.delete({})
  })

  it('should create a transaction and a payable', async () => {
    const transaction = await transactionService.createTransaction(creditCradTransactionDTO)
    const payables = await Payable.find({ relations: ['originatingTransaction'] })

    expect(transaction).toEqual(expect.objectContaining({
      ...creditCradTransactionDTO,
      uuid: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    }))

    expect(payables).toHaveLength(1)
    expect(payables[0]).toEqual(expect.objectContaining({
      merchantId: transaction.merchantId,
      subtotal: transaction.value,
      date: expect.any(Date),
      originatingTransaction: expect.objectContaining({ uuid: transaction.uuid }),
    }))
  })

  it('should not create a transaction without a payable', async () => {
    jest.mock('../../src/domain/Payable/payable')
    Payable.createPayableFromTransaction = jest.fn().mockImplementationOnce(() => {
      throw new Error('error creating payable')
    })

    try {
      await transactionService.createTransaction(creditCradTransactionDTO)
      fail('it\'s not supposed to reach here.')
    } catch (e) {
      const payables = await Payable.find({})
      const transactions = await Transaction.find({})
      expect(payables).toHaveLength(0)
      expect(transactions).toHaveLength(0)
    }
  })
})
