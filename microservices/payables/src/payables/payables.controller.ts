import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PayablesService } from './payables.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { SummaryByMerchantId } from './dto/find-all-by-merchant-id.dto';

@Controller()
export class PayablesController {
  constructor(private readonly payablesService: PayablesService) {}

  @MessagePattern('createPayables')
  create(@Payload() createPayableDto: CreatePayableDto) {
    return this.payablesService.create(createPayableDto);
  }

  @MessagePattern('summaryPayables')
  async summary(@Payload() request: SummaryByMerchantId) {
    return await this.payablesService.summary(request);
  }
}
