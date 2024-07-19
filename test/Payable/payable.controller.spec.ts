import request from 'supertest'
import { TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { addMinutes, subMinutes } from 'date-fns'
import { PaymentMethod, Transaction } from '../../src/domain/Transaction/transaction'
import { createModuleForIntegrationTest } from '../../src/commons/utils'
import { transactionModuleMetadata } from '../../src/domain/Transaction/transaction.module'
import { Payable } from '../../src/domain/Payable/payable'
import { ApiErrorFilter } from '../../src/commons/api-error.filter'
import { PayableQueryParams } from '../../src/domain/Payable/payable.query-params'
import { TransactionService } from '../../src/domain/Transaction/transaction.service'
import { buildTransactionDTO } from '../Transaction/transaction.fixture'
import { PayableService } from '../../src/domain/Payable/payable.service'

/**
 * @group integration
 */
describe('PayableController', () => {
  const transactionDTO = buildTransactionDTO(PaymentMethod.DEBIT_CARD)
  let module: TestingModule

  let app: INestApplication
  let transactionService: TransactionService
  let payableService: PayableService

  beforeAll(async () => {
    module = await createModuleForIntegrationTest(transactionModuleMetadata)
    app = module.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalFilters(new ApiErrorFilter())
    await app.init()
    transactionService = module.get(TransactionService)
    payableService = module.get(PayableService)
  })

  afterAll(async () => {
    module.close()
  })

  afterEach(async () => {
    await Payable.delete({})
    await Transaction.delete({})
  })

  const getParams = {
    merchantId: transactionDTO.merchantId,
    fromDate: subMinutes(new Date(), 1),
    toDate: addMinutes(new Date(), 1),
  }

  async function getPayableTotals(params?: PayableQueryParams) {
    const url = params ? `/payable/totals?merchantId=${params.merchantId}&fromDate=${params.fromDate.toISOString()}&toDate=${params.toDate.toISOString()}`
      : '/payable/totals'
    return request(app.getHttpServer())
      .get(url)
      .set('Accept', 'application/json')
  }

  it('should return 200 with payable totals', async () => {
    const transaction = await transactionService.createTransaction(transactionDTO)
    const payableCreated = await Payable.findOneByOrFail({ originatingTransaction: { uuid: transaction.uuid } })

    const result = await getPayableTotals(getParams)
    expect(result.status).toBe(200)
    const { body } = result
    expect(body.totalPaid).toEqual(payableCreated.total)
    expect(body.totalPaidFees).toEqual(payableCreated.discount)
    expect(body.totalToBeReceived).toEqual(0)
  })

  it('should return 400 if the query fields are not informed', async () => {
    const result = await getPayableTotals()
    expect(result.status).toBe(400)
    const { body } = result
    expect(body.message).toContain('merchantId should not be null or undefined')
    expect(body.message).toContain('fromDate should not be null or undefined')
    expect(body.message).toContain('toDate should not be null or undefined')
  })

  it('should return 500 if something goes wrong', async () => {
    const whateverErrorMsg = 'whatever'
    jest.spyOn(payableService, 'getPayablesTotalsByMerchant').mockImplementationOnce(() => { throw new Error(whateverErrorMsg) })
    const result = await getPayableTotals(getParams)
    expect(result.status).toBe(500)
    expect(result.text).toBe(`Something went wrong. ${whateverErrorMsg}`)
  })
})
