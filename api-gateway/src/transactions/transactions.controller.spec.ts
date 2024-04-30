import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { CommandBus } from '@nestjs/cqrs';
import { PaymentMethodEnum } from './dto/create-transaction.dto';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be created transaction successfully', async () => {
      const transactionId = 'd56c4697-7fdf-448f-8058-b0ded929cd3d';
      const merchantId = '2a9bb82f-3d8f-4196-9dfb-ba95639a6e93';
      const transaction_mock = {
        description: 'T-Shirt Black M',
        totalValue: 500,
        paymentMethod: PaymentMethodEnum.DEBIT_CARD,
        card: {
          holder: 'John Smith',
          number: 4338,
          expirationDate: '12/2028',
          cvv: '233',
        },
      };

      jest.spyOn(commandBus, 'execute').mockResolvedValue({
        ...transaction_mock,
        id: transactionId,
      });

      const exec = await controller.create(merchantId, transaction_mock);

      expect(commandBus.execute).toHaveBeenCalledTimes(1);
      expect(exec.id).toEqual(transactionId);
    });
  });
});
