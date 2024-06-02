import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TRANSACTION_SERVICE_PROVIDE } from '../../../core/services/transaction/transaction.service';
import { TransactionDTOFixture } from './fixtures/transaction.dto.fixture';
import { transactionServiceFixture } from './fixtures/transaction.service.fixture';
import { CardDTOFixture } from './fixtures/card.dto.fixture';

describe('TransactionController', () => {
  let transactionController: TransactionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TRANSACTION_SERVICE_PROVIDE,
          useValue: transactionServiceFixture,
        },
      ],
    }).compile();

    transactionController = app.get<TransactionController>(
      TransactionController,
    );
  });

  describe('PUT /transaction', () => {
    it('should filter only 4 last digits of the card number', () => {
      const cardInput = CardDTOFixture.default();
      cardInput.number = '1234567898754321';

      const card = cardInput.toCard();

      expect(card.number).toBe('4321');
      expect(card.holder).toBe(cardInput.holder);
      expect(card.cvv).toBe(cardInput.cvv);
      expect(card.expirationDate).toBe(cardInput.expirationDate);
    });

    it('should return Transaction model', async () => {
      const transactionInput = TransactionDTOFixture.default();
      const transaction = transactionInput.toTransaction();

      expect(
        await transactionController.createTransaction(transactionInput),
      ).toEqual(transaction);
    });

    it('should call TransactionServiceFixture.createTransaction with converted input', async () => {
      const transactionInput = TransactionDTOFixture.default();
      const transaction = transactionInput.toTransaction();
      await transactionController.createTransaction(transactionInput);

      expect(transactionServiceFixture.createTransaction).toHaveBeenCalledWith(
        transaction,
      );
    });
  });
});
