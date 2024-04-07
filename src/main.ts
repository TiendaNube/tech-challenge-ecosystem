import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/nestjs/app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@infrastructure/nestjs/filters/http-exception-filter';
import { setupSwagger } from '@infrastructure/nestjs/helpers/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //setupSwagger(app);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
}
bootstrap();
