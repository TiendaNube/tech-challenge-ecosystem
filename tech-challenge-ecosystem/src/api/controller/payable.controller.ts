import { Controller, Get, Inject, Logger, Query } from '@nestjs/common';
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

  private logger = new Logger(PayableController.name);

  @Get('/summary')
  async summarizeByMerchant(@Query() queryFilters: PayableSummaryFilterDTO) {
    this.logger.log(
      `Summarizing payables with queries: ${JSON.stringify(queryFilters)}`,
    );

    const summaries = await this.payableService.summarizeByMerchant(
      Number(queryFilters.merchantId),
      new Date(queryFilters.startDate),
      new Date(queryFilters.endDate),
    );

    this.logger.log(`Summarized payables successfully`);

    return PayableSummaryDTO.fromSummarizedPayables(summaries);
  }
}
