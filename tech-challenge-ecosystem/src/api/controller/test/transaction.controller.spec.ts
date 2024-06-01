import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TRANSACTION_SERVICE_PROVIDE } from '../../../core/services/transaction/transaction.service';
import { TransactionDTOFixture } from './fixtures/transaction.dto.fixture';
import { TransactionServiceFixture } from './fixtures/transaction.service.fixture';

describe('TransactionController', () => {
  let transactionController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TRANSACTION_SERVICE_PROVIDE,
          useClass: TransactionServiceFixture,
        },
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
  });

  describe('PUT /transaction', () => {
    it('should return Transaction model', async () => {
      const transactionInput = TransactionDTOFixture.default();
      expect(
        await transactionController.createTransaction(transactionInput),
      ).toEqual(transactionInput.toTransaction());
    });
  });
});
