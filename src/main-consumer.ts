import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsumerModule } from './consumer/consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);
  app.init();
}
bootstrap();
