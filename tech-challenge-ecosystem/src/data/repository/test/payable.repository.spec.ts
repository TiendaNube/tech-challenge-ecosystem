import { Test, TestingModule } from '@nestjs/testing';
import { PAYABLE_TYPEORM_REPOSITORY } from '../../entities/payable.entity';
import { TRANSACTION_TYPEORM_REPOSITORY } from '../../entities/transaction.entity';
import { PayableRepository } from '../payable.repository';
import { PAYABLE_DATASOURCE_PROVIDE } from '../../../core/contracts/data/payable.datasource';
import { transactionTypeormRepositoryFixture } from './fixtures/transaction.typeorm.repository.fixture';
import { payableTypeormRepositoryFixture } from './fixtures/payable.typeorm.repository.fixture';
import { PayableEntityFixture } from '../../entities/fixtures/payable.entity.fixture';
import { Between } from 'typeorm';
import { PayableFixture } from '../../../core/models/test/fixtures/payable.fixture';
import { TransactionFixture } from '../../../core/models/test/fixtures/transaction.fixture';
import { TransactionEntityFixture } from '../../entities/fixtures/transaction.entity.fixture';

describe('PayableRepository', () => {
  let payableRepository: PayableRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PAYABLE_TYPEORM_REPOSITORY,
          useValue: payableTypeormRepositoryFixture,
        },
        {
          provide: TRANSACTION_TYPEORM_REPOSITORY,
          useValue: transactionTypeormRepositoryFixture,
        },
        {
          provide: PAYABLE_DATASOURCE_PROVIDE,
          useClass: PayableRepository,
        },
      ],
      exports: [
        {
          provide: PAYABLE_DATASOURCE_PROVIDE,
          useClass: PayableRepository,
        },
      ],
    }).compile();

    payableRepository = app.get<PayableRepository>(PAYABLE_DATASOURCE_PROVIDE);

    jest.clearAllMocks();
  });

  describe('PayableRepository.listByMerchantId', () => {
    it('should list by merchant from database', async () => {
      const payableEntity = PayableEntityFixture.default();
      payableTypeormRepositoryFixture.find.mockImplementationOnce(() => {
        return [payableEntity];
      });

      const startDate = new Date();
      const endDate = new Date();

      const response = await payableRepository.listByMerchantId(
        1,
        startDate,
        endDate,
      );

      expect(payableTypeormRepositoryFixture.find).toHaveBeenCalledWith({
        where: {
          merchantId: 1,
          date: Between(startDate, endDate),
        },
      });

      expect(response).toEqual([payableEntity.toPayable()]);
    });
  });

  describe('PayableRepository.create', () => {
    it('should throw error if no transaction is found', async () => {
      const payable = PayableFixture.default();
      payable.transaction = TransactionFixture.default();

      transactionTypeormRepositoryFixture.findOneBy.mockResolvedValueOnce(
        undefined,
      );

      await expect(async () => {
        await payableRepository.create(payable);
      }).rejects.toThrow();
    });

    it('should query transaction before creating payable', async () => {
      const transaction = TransactionFixture.default();

      const payable = PayableFixture.default();
      payable.transaction = transaction;

      transactionTypeormRepositoryFixture.findOneBy.mockResolvedValueOnce(
        transaction,
      );

      const payableEntity = PayableEntityFixture.default();

      payableTypeormRepositoryFixture.create.mockResolvedValueOnce(
        payableEntity,
      );

      payableTypeormRepositoryFixture.save.mockResolvedValueOnce(payableEntity);

      await payableRepository.create(payable);

      expect(
        transactionTypeormRepositoryFixture.findOneBy,
      ).toHaveBeenCalledWith({
        id: payable.transaction?.id ?? '',
      });
    });

    it('should create payable', async () => {
      const transactionEntity = TransactionEntityFixture.default();
      const payable = PayableFixture.default();
      payable.transaction = transactionEntity.toTransaction();

      transactionTypeormRepositoryFixture.findOneBy.mockResolvedValueOnce(
        transactionEntity,
      );

      const payableEntity = PayableEntityFixture.default();
      payableEntity.date = payable.date;
      payableEntity.transaction = transactionEntity;

      payableTypeormRepositoryFixture.create.mockReturnValueOnce(payableEntity);

      payableTypeormRepositoryFixture.save.mockResolvedValueOnce(payableEntity);

      const payableEntityCopy = { ...payableEntity, transaction: undefined };
      const result = await payableRepository.create(payable);

      expect(payableTypeormRepositoryFixture.create).toHaveBeenCalledWith(
        payableEntityCopy,
      );
      expect(payableTypeormRepositoryFixture.save).toHaveBeenCalledWith(
        payableEntity,
      );
      expect(result).toEqual(payableEntity.toPayable());
    });
  });
});
