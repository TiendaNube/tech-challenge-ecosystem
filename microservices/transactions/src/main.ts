import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
  const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBITMQ_HOST}:${RABBITMQ_PORT}`],
        queue: 'transactions',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}

((): void => {
  const PORT = process.env.APP_PORT || 3000;
  bootstrap()
    .then(() => process.stdout.write(`Listening on port ${PORT}...\n`))
    .catch((err) => {
      process.stderr.write(`Error: ${err.message}\n`);
      process.exit(1);
    });
})();
