import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { Payable } from '../transaction/entities/payable.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Init1711831141703 } from '../migrations/1711831141703-init';
import { JoinColumns1711834614562 } from '../migrations/1711834614562-joinColumns';
import { JoinColumnsFix1711836623698 } from '../migrations/1711836623698-joinColumnsFix';
import { RemoveRedundantColumn1711836778102 } from '../migrations/1711836778102-removeRedundantColumn';
import { AddMerchantToPayable1711894604104 } from '../migrations/1711894604104-addMerchantToPayable';

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.env.POSTGRES_HOST ?? '',
      port: +(this.env.POSTGRES_PORT ?? 5432),
      username: this.env.POSTGRES_USER ?? '',
      password: this.env.POSTGRES_PASSWORD ?? '',
      database: this.env.POSTGRES_DATABASE ?? '',
      entities: [Transaction, Payable],
      migrations: [
        Init1711831141703,
        JoinColumns1711834614562,
        JoinColumnsFix1711836623698,
        RemoveRedundantColumn1711836778102,
        AddMerchantToPayable1711894604104,
      ],
      migrationsTableName: 'migrations',
      migrationsRun: this.env.RUN_MIGRATIONS === 'true',
      synchronize: false,
      logger: 'debug',
      logging: 'all',
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
