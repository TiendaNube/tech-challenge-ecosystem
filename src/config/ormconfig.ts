import { configService } from './config.service';
import { DataSource } from 'typeorm';

export const connectionSource = new DataSource(
  {
    ...(configService.getTypeOrmConfig() as any), 
    
  }
);
