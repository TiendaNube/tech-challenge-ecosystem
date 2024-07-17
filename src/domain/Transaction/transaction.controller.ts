import { Controller, Get } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly appService: TransactionService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
