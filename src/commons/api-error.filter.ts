import { ArgumentsHost,
  ExceptionFilter,
  Catch,
  HttpStatus,
  Logger } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import { Response } from 'express'

@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiErrorFilter.name)

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (error instanceof HttpException) {
      this.logger.warn(error, error.getResponse())
      return response.status(error.getStatus()).send(error.getResponse())
    }

    this.logger.error(error.stack)
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(`Something went wrong. ${error.message}`)
  }
}
