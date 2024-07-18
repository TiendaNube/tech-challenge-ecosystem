import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ApiErrorFilter} from "./commons/api-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new ApiErrorFilter());
  await app.listen(3000);
}
bootstrap();
