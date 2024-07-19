import { Controller, Get, Query } from '@nestjs/common'
import { PayableService } from './payable.service'
import { PayableQueryParams } from './payable.query-params'

export interface PayablesTotalsResponse {
  totalPaid: number
  totalPaidFees: number
  totalToBeReceived: number
}

@Controller('/payable')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Get('/totals')
  public async getPayablesTotalsByMerchant(@Query() queryParams: PayableQueryParams): Promise<PayablesTotalsResponse> {
    return this.payableService.getPayablesTotalsByMerchant(queryParams)
  }
}
