import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentMethodEnum, Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnThis(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get(getRepositoryToken(Transaction));
  });

  describe('create', () => {
    it('should be created transaction sucessfully', async () => {
      const transactionId = '306e8c74-139c-4010-a991-565cec5bc053';
      const mock_transaction = {
        merchantId: '',
        description: 'T-Shirt Black M',
        totalValue: 500,
        paymentMethod: PaymentMethodEnum.DEBIT_CARD,
        card: {
          holder: 'John Smith',
          number: '4338',
          expirationDate: '12/2028',
          cvv: '233',
        },
      };
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mock_transaction,
        id: transactionId,
        cardLastFourDigits: '4444',
        createdAt: new Date(),
      });

      const exec = await service.create(mock_transaction);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(exec.id).toEqual(transactionId);
    });
  });

  describe('findOne', () => {
    it('should be find One transaction sucessfully', async () => {
      const transactionId = '306e8c74-139c-4010-a991-565cec5bc053';
      const mock_transaction = {
        merchantId: '',
        description: 'T-Shirt Black M',
        totalValue: 500,
        paymentMethod: PaymentMethodEnum.DEBIT_CARD,
        card: {
          holder: 'John Smith',
          number: '4338',
          expirationDate: '12/2028',
          cvv: '233',
        },
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue({
        ...mock_transaction,
        id: transactionId,
        cardLastFourDigits: '4444',
        createdAt: new Date(),
      });

      const exec = await service.findOne(transactionId);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(exec.id).toEqual(transactionId);
    });
  });
});
