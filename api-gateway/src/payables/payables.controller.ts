import { Controller, Get, Param, Query } from '@nestjs/common';
import { PayablesService } from './payables.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payables')
@Controller({ path: 'merchants/:id/payables', version: '1' })
export class PayablesController {
  constructor(private readonly payablesService: PayablesService) {}

  @Get()
  summary(
    @Param('id') merchantId: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.payablesService.summary(merchantId, {
      filters: {
        betweenDates:
          startDate && endDate
            ? {
                startDate,
                endDate,
              }
            : undefined,
      },
    });
  }
}
