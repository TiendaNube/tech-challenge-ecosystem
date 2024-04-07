import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/nestjs/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@infrastructure/nestjs/filters/http-exception-filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}
bootstrap();
