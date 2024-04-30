import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { Repository } from 'typeorm';
@Injectable()
export class MerchantSeedService {
  constructor(
    @InjectRepository(Merchant)
    private repository: Repository<Merchant>,
  ) {}

  async run() {
    const merchantId = '8e33fb74-8bdb-4f38-9f64-ca56c3051fa5';
    const isExist = await this.repository.count({
      where: {
        id: merchantId,
      },
    });

    if (isExist) {
      return;
    }

    await this.repository.save(
      this.repository.create({
        id: merchantId,
        name: 'John Smith',
        documentId: '11122233344',
      }),
    );
  }
}
