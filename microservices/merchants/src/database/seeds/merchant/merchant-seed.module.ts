import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { MerchantSeedService } from './merchant-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  providers: [MerchantSeedService],
  exports: [MerchantSeedService],
})
export class MerchantSeedModule {}
