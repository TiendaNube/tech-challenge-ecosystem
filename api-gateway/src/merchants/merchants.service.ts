import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { Merchant } from './models/merchant.model';
import { IMerchant } from './merchants.interfaces';
import { CLIENTS, EVENT_TIMEOUT } from 'src/utils/constants';
import { MESSAGE_PATTERNS } from 'src/utils/queue.constants';

@Injectable()
export class MerchantsService {
  constructor(
    @Inject(CLIENTS.MERCHANTS_CLIENT)
    private readonly merchantsClient: ClientProxy,
  ) {}

  private readonly logger = new Logger(MerchantsService.name);

  async findOne(id: string): Promise<Merchant> {
    this.logger.debug('[Request] MerchantsService.findOne.response', id);
    const response: IMerchant = await firstValueFrom(
      this.merchantsClient
        .send(MESSAGE_PATTERNS.merchant.findOne, {
          id,
        })
        .pipe(timeout(EVENT_TIMEOUT)),
    );

    if (!response) {
      throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }
    this.logger.debug('[Request] MerchantsService.findOne.response', response);

    const merchant = new Merchant(response.id);

    return merchant;
  }
}
