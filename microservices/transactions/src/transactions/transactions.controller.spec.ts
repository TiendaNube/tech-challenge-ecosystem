import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { CommandBus } from '@nestjs/cqrs';
import { PaymentMethodEnum } from './entities/transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    commandBus = module.get(CommandBus);
  });

  describe('create', () => {
    it('should be created transaction successfully', async () => {
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

      jest.spyOn(commandBus, 'execute').mockResolvedValue({
        ...mock_transaction,
        id: transactionId,
        cardLastFourDigits: '4444',
        createdAt: new Date(),
      });

      const execution = await controller.create(mock_transaction);

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(execution.id).toEqual(transactionId);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
