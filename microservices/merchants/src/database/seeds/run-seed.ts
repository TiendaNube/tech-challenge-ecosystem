import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { MerchantSeedService } from './merchant/merchant-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);
  await app.get(MerchantSeedService).run();
  await app.close();
};

void runSeed();
