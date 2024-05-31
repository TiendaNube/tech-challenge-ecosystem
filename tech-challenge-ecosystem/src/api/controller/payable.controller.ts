import { Controller, Get, Inject, Put, Query } from '@nestjs/common';
import {
  PAYABLE_SERVICE_PROVIDE,
  PayableService,
} from '../../core/services/payable/payable.service';
import { PayableSummaryFilterDTO } from '../models/payable.summary.filter.dto';
import { PayableSummaryDTO } from '../models/payable.summary.dto';

@Controller('/payable')
export class PayableController {
  constructor(
    @Inject(PAYABLE_SERVICE_PROVIDE)
    private readonly payableService: PayableService,
  ) {}

  @Get('/summary')
  async summarizeByMerchant(@Query() queryFilters: PayableSummaryFilterDTO) {
    const summaries = await this.payableService.summarizeByMerchant(
      Number(queryFilters.merchantId),
      new Date(queryFilters.startDate),
      new Date(queryFilters.endDate),
    );

    return PayableSummaryDTO.fromSummarizedPayables(summaries);
  }
}
