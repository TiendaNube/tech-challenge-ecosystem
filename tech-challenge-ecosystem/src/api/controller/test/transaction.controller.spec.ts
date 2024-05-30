import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TransactionService } from '../../../core/services/transaction/TransactionService';
import { TransactionInputFixture } from './fixtures/TransactionInputFixture';

describe('TransactionController', () => {
  let transactionController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
  });

  describe('PUT /transaction', () => {
    it('should return Transaction model', () => {
      const transactionInput = TransactionInputFixture.default();
      expect(transactionController.createTransaction(transactionInput)).toEqual(
        transactionInput.toTransaction(),
      );
    });
  });
});
