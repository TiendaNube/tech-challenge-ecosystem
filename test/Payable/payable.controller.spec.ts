import { Test, TestingModule } from '@nestjs/testing'
import { PayableController } from '../../src/domain/Payable/payable.controller'
import { PayableService } from '../../src/domain/Payable/payable.service'

describe('PayableController', () => {
  let appController: PayableController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [PayableService],
    }).compile()

    appController = app.get<PayableController>(PayableController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
