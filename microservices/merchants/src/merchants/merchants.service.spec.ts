import { Test, TestingModule } from '@nestjs/testing';
import { MerchantsService } from './merchants.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Merchant } from './entities/merchant.entity';
import { Repository } from 'typeorm';

describe('MerchantsService', () => {
  let service: MerchantsService;
  let repository: Repository<Merchant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        MerchantsService,
        {
          provide: getRepositoryToken(Merchant),
          useValue: {
            save: jest.fn(),
            create: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MerchantsService);
    repository = module.get(getRepositoryToken(Merchant));
  });

  describe('create', () => {
    it('should be created merchant sucessfully', async () => {
      const merchantId = 'ed989a4e-f2c4-4f17-a3c6-5429bff31edd';
      const merchant = {
        name: 'John Smith',
        documentId: '1112223334455',
      };

      jest.spyOn(repository, 'save').mockResolvedValue({
        ...merchant,
        id: merchantId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const execution = await service.create(merchant);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
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

      jest.spyOn(repository, 'findOne').mockResolvedValue({
        ...merchant,
        id: merchantId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const execution = await service.findOne(merchantId);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(execution.id).toEqual(merchantId);
    });
  });
});
