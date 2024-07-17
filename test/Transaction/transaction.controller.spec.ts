import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../src/domain/Transaction/transaction.controller';
import { TransactionService } from '../../src/domain/Transaction/transaction.service';

describe('TransactionController', () => {
  let appController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    appController = app.get<TransactionController>(TransactionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
