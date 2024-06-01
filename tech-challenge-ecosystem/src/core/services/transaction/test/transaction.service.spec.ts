import { Test, TestingModule } from '@nestjs/testing';
import { TransactionFixture } from '../../../models/test/fixtures/transaction.fixture';
import {
  TRANSACTION_SERVICE_PROVIDE,
  TransactionService,
} from '../transaction.service';
import { TRANSACTION_MESSAGE_PRODUCER_PROVIDE } from '../../../constracts/messaging/transaction.message.producer';
import { transactionMessageProducerFixture } from '../../../constracts/messaging/fixture/transaction.message.producer.fixture';
import { TRANSACTION_DATASOURCE_PROVIDE } from '../../../constracts/data/transaction.datasource';
import { transactionDatasourceFixture } from '../../../constracts/data/fixtures/transaction.datasource.fixture';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TRANSACTION_SERVICE_PROVIDE,
          useClass: TransactionService,
        },
        {
          provide: TRANSACTION_MESSAGE_PRODUCER_PROVIDE,
          useValue: transactionMessageProducerFixture,
        },
        {
          provide: TRANSACTION_DATASOURCE_PROVIDE,
          useValue: transactionDatasourceFixture,
        },
      ],
      exports: [
        {
          provide: TRANSACTION_SERVICE_PROVIDE,
          useClass: TransactionService,
        },
      ],
    }).compile();

    transactionService = app.get<TransactionService>(
      TRANSACTION_SERVICE_PROVIDE,
    );

    jest.clearAllMocks();
  });

  describe('TransactionService.createTransaction', () => {
    it('should create transaction', async () => {
      const transaction = TransactionFixture.default();

      transactionDatasourceFixture.create.mockReturnValueOnce(transaction);

      const result = await transactionService.createTransaction(transaction);

      expect(
        transactionMessageProducerFixture.sendMessage,
      ).toHaveBeenCalledWith(transaction);
      expect(transactionDatasourceFixture.create).toHaveBeenCalledWith(
        transaction,
      );
      expect(result).toEqual(transaction);
    });
  });
});
