import { Injectable } from '@nestjs/common';

@Injectable()
export class PayableService {
  getHello(): string {
    return 'Hello World!';
  }
}
