import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MESSAGE_PATTERNS } from 'src/utils/queue.constants';
import { PayableDashboard } from './payables.interfaces';
import { CLIENTS } from 'src/utils/constants';

@Injectable()
export class PayablesService {
  private readonly logger = new Logger(PayablesService.name);

  constructor(
    @Inject(CLIENTS.PAYABLES_CLIENT)
    private readonly payableClient: ClientProxy,
  ) {}

  async summary(
    id: string,
    {
      filters,
    }: {
      filters?: {
        betweenDates?: {
          startDate: string;
          endDate: string;
        };
      };
    },
  ) {
    this.logger.debug('[Request] MerchantsService.summary');

    const response: PayableDashboard = await firstValueFrom(
      this.payableClient.send(MESSAGE_PATTERNS.payables.summary, {
        merchantId: id,
        filters,
      }),
    );

    this.logger.debug('[Request] MerchantsService.summary.response', response);

    return response;
  }
}
