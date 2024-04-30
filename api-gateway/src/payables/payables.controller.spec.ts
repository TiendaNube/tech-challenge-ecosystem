import { Test, TestingModule } from '@nestjs/testing';
import { PayablesController } from './payables.controller';
import { PayablesService } from './payables.service';

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
            summary: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PayablesController>(PayablesController);
    service = module.get(PayablesService);
  });

  describe('summary', () => {
    it('should be summary the payables successfully', async () => {
      const merchantId = 'bd62a9f7-57d9-41f7-a83a-d31da6cce79c';
      const filters = {
        betweenDates: {
          startDate: '2020-01-01',
          endDate: '2020-05-01',
        },
      };

      const serviceResponse = {
        totalPaid: 0,
        discountPaid: 0,
        futureEarnings: 0,
      };

      jest.spyOn(service, 'summary').mockResolvedValue(serviceResponse);

      const execution = await controller.summary(
        merchantId,
        filters.betweenDates.startDate,
        filters.betweenDates.endDate,
      );

      expect(service.summary).toHaveBeenCalledTimes(1);
      expect(execution).toEqual(serviceResponse);
    });
  });
});
