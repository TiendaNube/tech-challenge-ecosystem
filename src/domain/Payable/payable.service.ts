import { Injectable } from '@nestjs/common'
import { Between } from 'typeorm'
import { toCurrency } from '../../commons/utils'
import { Payable, PayableStatus } from './payable'
import { PayableQueryParams } from './payable.query-params'
import { PayablesTotalsResponse } from './payable.controller'

@Injectable()
export class PayableService {
  async getPayablesTotalsByMerchant(queryParams: PayableQueryParams) : Promise<PayablesTotalsResponse> {
    const { merchantId, fromDate, toDate } = queryParams

    const payables = await Payable.find({
      where: {
        merchantId,
        date: Between(fromDate, toDate),
      },
    })

    const paidPayables = payables.filter((p) => p.status === PayableStatus.PAID)
    const futurePayables = payables.filter((p) => p.status === PayableStatus.WAITING_FUNDS)

    const totalPaid = paidPayables.reduce((sum, payable): number => (sum + payable.total), 0)
    const totalPaidFees = paidPayables.reduce((sum, payable): number => (sum + payable.discount), 0)
    const totalToBeReceived = futurePayables.reduce((sum, payable): number => (sum + payable.total), 0)

    return {
      totalPaid: toCurrency(totalPaid),
      totalPaidFees: toCurrency(totalPaidFees),
      totalToBeReceived: toCurrency(totalToBeReceived),
    }
  }
}
