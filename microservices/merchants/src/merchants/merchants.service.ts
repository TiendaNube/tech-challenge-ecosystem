import { Injectable } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  create(createMerchantDto: CreateMerchantDto) {
    return this.merchantRepository.save(
      this.merchantRepository.create(createMerchantDto),
    );
  }

  findOne(id: string) {
    return this.merchantRepository.findOne({
      where: {
        id,
      },
    });
  }
}
