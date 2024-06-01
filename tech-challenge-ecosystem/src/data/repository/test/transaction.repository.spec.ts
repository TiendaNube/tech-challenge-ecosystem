import { Test, TestingModule } from '@nestjs/testing';
import {
  TRANSACTION_TYPEORM_REPOSITORY,
  TransactionEntity,
} from '../../entities/transaction.entity';
import { transactionTypeormRepositoryFixture } from './fixtures/transaction.typeorm.repository.fixture';
import { TransactionFixture } from '../../../core/models/test/fixtures/transaction.fixture';
import { TransactionRepository } from '../transaction.repository';
import { TRANSACTION_DATASOURCE_PROVIDE } from '../../../core/constracts/data/transaction.datasource';

describe('TransactionRepository', () => {
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TRANSACTION_TYPEORM_REPOSITORY,
          useValue: transactionTypeormRepositoryFixture,
        },
        {
          provide: TRANSACTION_DATASOURCE_PROVIDE,
          useClass: TransactionRepository,
        },
      ],
      exports: [
        {
          provide: TRANSACTION_DATASOURCE_PROVIDE,
          useClass: TransactionRepository,
        },
      ],
    }).compile();

    transactionRepository = app.get<TransactionRepository>(
      TRANSACTION_DATASOURCE_PROVIDE,
    );

    jest.clearAllMocks();
  });

  describe('TransactionRepository.create', () => {
    it('should create a transaction into database', async () => {
      const transaction = TransactionFixture.default();
      const transactionEntity = TransactionEntity.fromTransaction(transaction);

      transactionTypeormRepositoryFixture.save.mockImplementationOnce(() => {
        return transactionEntity;
      });

      const response = await transactionRepository.create(transaction);

      expect(transactionTypeormRepositoryFixture.save).toHaveBeenCalledWith(
        transactionEntity,
      );
      expect(response).toEqual(transactionEntity.toTransaction());
    });
  });
});
