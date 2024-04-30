import { Test, TestingModule } from '@nestjs/testing';
import { MerchantsController } from './merchants.controller';
import { MerchantsService } from './merchants.service';

describe('MerchantsController', () => {
  let controller: MerchantsController;
  let service: MerchantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantsController],
      providers: [
        {
          provide: MerchantsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MerchantsController>(MerchantsController);
    service = module.get(MerchantsService);
  });

  describe('create', () => {
    it('should be created merchant sucessfully', async () => {
      const merchantId = 'ed989a4e-f2c4-4f17-a3c6-5429bff31edd';
      const merchant = {
        name: 'John Smith',
        documentId: '1112223334455',
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        ...merchant,
        id: merchantId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const execution = await controller.create(merchant);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(execution.id).toEqual(merchantId);
    });
  });

  describe('findOne', () => {
    it('should be find one merchant sucessfully', async () => {
      const merchantId = 'ed989a4e-f2c4-4f17-a3c6-5429bff31edd';
      const merchant = {
        name: 'John Smith',
        documentId: '1112223334455',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...merchant,
        id: merchantId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const execution = await controller.findOne(merchantId);

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(execution.id).toEqual(merchantId);
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
