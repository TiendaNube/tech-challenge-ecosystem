import request from 'supertest'
import { TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Transaction } from '../../src/domain/Transaction/transaction'
import { createModuleForIntegrationTest } from '../../src/commons/utils'
import { transactionModuleMetadata } from '../../src/domain/Transaction/transaction.module'
import { Payable } from '../../src/domain/Payable/payable'
import { ApiErrorFilter } from '../../src/commons/api-error.filter'
import { buildTransactionDTO } from './transaction.fixture'

/**
 * @group integration
 */
describe('TransactionController', () => {
  const creditCradTransactionDTO = buildTransactionDTO()
  let module: TestingModule

  let app: INestApplication

  beforeAll(async () => {
    module = await createModuleForIntegrationTest(transactionModuleMetadata)
    app = module.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalFilters(new ApiErrorFilter())
    await app.init()
  })

  afterAll(async () => {
    module.close()
  })

  afterEach(async () => {
    await Payable.delete({})
    await Transaction.delete({})
  })

  async function postTransaction(requestBody: any) {
    return request(app.getHttpServer()).post('/transaction')
      .send(requestBody).set('Accept', 'application/json')
  }

  it('should create a new transaction and return 200', async () => {
    const result = await postTransaction(creditCradTransactionDTO)
    expect(result.status).toBe(201)
    const { body } = result
    expect(body.uuid).toBeDefined()
  })

  it('should return 400 if the transaction fields not informed', async () => {
    const result = await postTransaction({})
    expect(result.status).toBe(400)
    const { body } = result
    expect(body.message).toContain('merchantId should not be null or undefined')
    expect(body.message).toContain('description should not be null or undefined')
    expect(body.message).toContain('paymentMethod should not be null or undefined')
    expect(body.message).toContain('cardNumber should not be null or undefined')
    expect(body.message).toContain('cardHolder should not be null or undefined')
    expect(body.message).toContain('value should not be null or undefined')
    expect(body.message).toContain('cardExpirationDate should not be null or undefined')
    expect(body.message).toContain('cardCVV should not be null or undefined')
  })

  it('should return 500 if something goes wrong', async () => {
    const genericErrorMsg = 'error creating payable'
    jest.mock('../../src/domain/Payable/payable')
    Payable.createPayableFromTransaction = jest.fn().mockImplementationOnce(() => {
      throw new Error(genericErrorMsg)
    })
    const result = await postTransaction(creditCradTransactionDTO)
    expect(result.status).toBe(500)
    expect(result.text).toEqual(`Something went wrong. ${genericErrorMsg}`)
  })
})
