import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from '../config/config-typorm-module';
import { PaymentEntity } from './entities/payment.entity';
import { ReceivableEntity } from './entities/receivable.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
        }),
        TypeOrmModule.forFeature([PaymentEntity, ReceivableEntity]),
    ],
    providers: [],
    exports: [],
})
export class PostgreSqlModule {}
