import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';

@Controller()
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @MessagePattern('createMerchant')
  create(@Payload() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.create(createMerchantDto);
  }

  @MessagePattern('findOneMerchant')
  findOne(@Payload('id') id: string) {
    return this.merchantsService.findOne(id);
  }
}
