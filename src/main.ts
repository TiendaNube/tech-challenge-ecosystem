import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { ApiErrorFilter } from './commons/api-error.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors()
  app.useGlobalFilters(new ApiErrorFilter())
  await app.listen(3000)
}
bootstrap()
