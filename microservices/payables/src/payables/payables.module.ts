import { Module } from '@nestjs/common';
import { PayablesService } from './payables.service';
import { PayablesController } from './payables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payable } from './entities/payable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payable])],
  controllers: [PayablesController],
  providers: [PayablesService],
})
export class PayablesModule {}
