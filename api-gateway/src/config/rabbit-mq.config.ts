import { registerAs } from '@nestjs/config';
import { RabbitMqConfig } from './config.type';

export default registerAs<RabbitMqConfig>('rabbitmq', () => ({
  port: process.env.RABBITMQ_PORT
    ? parseInt(process.env.RABBITMQ_PORT, 10)
    : 6379,
  host: process.env.RABBITMQ_HOST || 'localhost',
}));
