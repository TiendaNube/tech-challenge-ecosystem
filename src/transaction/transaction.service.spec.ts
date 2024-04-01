import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { DataSource } from 'typeorm';
import { AmqpService } from '../amqp/amqp.service';
import {
  CreateTransactionDto,
  PaymentMethod,
} from './dtos/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { create } from 'domain';

describe('TransactionService', () => {
  let service: TransactionService;

  const transactionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const dataSourceManager = {
    save: jest.fn(),
  };

  const dataSource = {
    createQueryRunner: () => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      manager: dataSourceManager,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'TransactionRepository',
          useValue: transactionRepository,
        },
        {
          provide: 'PayableRepository',
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
        {
          provide: AmqpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        totalValue: 100,
        description: 'Test Transaction',
        paymentMethod: PaymentMethod.CreditCard,
        cardLastDigits: '1234',
        cardHolderName: 'John Doe',
        expirationDate: new Date('2025-12-31T00:00:00'),
        cvv: '123',
        merchantId: 'merchant1',
      };

      const newTransaction = Object.assign(
        new Transaction(),
        createTransactionDto,
      );
      newTransaction.id = 'a8a318e3-852c-4cd1-968a-b2273577458a';

      transactionRepository.create.mockClear().mockReturnValue(newTransaction);

      dataSourceManager.save.mockClear().mockResolvedValue(newTransaction);

      const result = await service.createTransaction(createTransactionDto);

      expect(result).toEqual(newTransaction);
      expect(transactionRepository.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
      expect(dataSourceManager.save).toHaveBeenCalledWith(newTransaction);
    });
  });
});
