import { Test, TestingModule } from '@nestjs/testing';
import { PayablesController } from './payables.controller';
import { PayablesService } from './payables.service';
import {
  PayableStatusEnum,
  PaymentMethodEnum,
} from './entities/payable.entity';

describe('PayablesController', () => {
  let controller: PayablesController;
  let service: PayablesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayablesController],
      providers: [
        {
          provide: PayablesService,
          useValue: {
            create: jest.fn(),
            summary: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PayablesController>(PayablesController);
    service = module.get<PayablesService>(PayablesService);
  });

  describe('create', () => {
    it('should be created payable successfully', async () => {
      const mockPayable = {
        merchantId: 'string',
        transactionId: 'string',
        totalValue: 50,
        paymentMethod: PaymentMethodEnum.DEBIT_CARD,
        cardHolder: 'John Smith',
        cardNumber: '123321123321123321',
        cardExpirationDate: '20/27',
        cardCvv: '233',
      };

      const mocked_response = {
        ...mockPayable,
        id: '8e33fb74-8bdb-4f38-9f64-ca56c3051fa5',
        status: PayableStatusEnum.PAID,
        discount: 0,
        subtotal: 0,
        total: mockPayable.totalValue,
        createdAt: new Date(),
        transactionAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(mocked_response);

      const execution = await controller.create(mockPayable);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(execution.id).toEqual(mocked_response.id);
    });
  });

  describe('summary', () => {
    it('should be summarized payables sucessfully', async () => {
      const payload = {
        merchantId: '8e33fb74-8bdb-4f38-9f64-ca56c3051fa5',
        filters: {
          betweenDates: {
            startDate: '2024-01-10',
            endDate: '2024-10-10',
          },
        },
      };

      const mocked_response = {
        totalPaid: 0,
        feePaid: 0,
        futureEarnings: 0,
      };

      jest.spyOn(service, 'summary').mockResolvedValue(mocked_response);

      const execution = await controller.summary(payload);

      expect(service.summary).toHaveBeenCalledTimes(1);
      expect(execution.totalPaid).toEqual(mocked_response.totalPaid);
    });
  });
});
