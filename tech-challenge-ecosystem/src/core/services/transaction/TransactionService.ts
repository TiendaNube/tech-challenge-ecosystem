import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionService {
  createTransaction(): string {
    return 'Hello from TransactionService.createTransaction()';
  }
}
