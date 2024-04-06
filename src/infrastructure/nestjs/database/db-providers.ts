import { DataSource } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { ConfigService } from '@nestjs/config';

export const dbProviders = [
    {
        provide: 'DATA_SOURCE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get('DB_PORT', 5432),
                username: configService.get<string>('DB_USERNAME', 'admin'),
                password: configService.get<string>('DB_PASSWORD', 'root'),
                migrations: [`${__dirname}/migrations/*`],
                migrationsRun: configService.get<boolean>(
                    'RUN_MIGRATIONS',
                    false,
                ),
                database: configService.get<string>(
                    'DB_NAME',
                    'tech-ecosystem',
                ),
                entities: [TransactionEntity],
                synchronize: false,
            });

            return dataSource.initialize();
        },
    },
];
