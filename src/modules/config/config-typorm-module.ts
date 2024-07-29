import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ReceivableEntity } from '../postgresql/entities/receivable.entity';
import { PaymentEntity } from '../postgresql/entities/payment.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
            entities: [PaymentEntity, ReceivableEntity],
            ssl: false,
            logging: false,
            schema: 'public',
            applicationName: `tech-challenge-ecosystem - ${this.configService.get<string>('NODE_ENV').toUpperCase()}`,
        };
    }
}
