import { Controller, Get } from '@nestjs/common';
import { PayableService } from './payable.service';

@Controller()
export class PayableController {
  constructor(private readonly appService: PayableService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
