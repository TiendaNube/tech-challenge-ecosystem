import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreatePayableDto } from './dto/create-payable.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SummaryByMerchantId } from './dto/find-all-by-merchant-id.dto';
import { PayableModel } from './factory/payable.factory';
import { Repository } from 'typeorm';
import { Payable, PayableStatusEnum } from './entities/payable.entity';
import {
  addDays,
  endOfDay,
  endOfMonth,
  isBefore,
  startOfDay,
  startOfMonth,
} from 'date-fns';

@Injectable()
export class PayablesService {
  constructor(
    @InjectRepository(Payable)
    private readonly payablesRepository: Repository<Payable>,
  ) {}

  private readonly logger = new Logger(PayablesService.name);

  create(createPayableDto: CreatePayableDto) {
    this.logger.debug('[Request] PayablesService.create ', createPayableDto);
    const model = new PayableModel(createPayableDto);
    const create = model.createObject();
    return this.payablesRepository.save(this.payablesRepository.create(create));
  }

  async summary({ merchantId, filters }: SummaryByMerchantId) {
    this.logger.debug(
      '[Request] PayablesService.summarize ',
      merchantId,
      filters,
    );

    const { startDate, endDate } = this.validateBetweenDates({
      startDate:
        filters?.betweenDates?.startDate ||
        startOfMonth(new Date()).toISOString(),
      endDate:
        filters?.betweenDates?.endDate || endOfMonth(new Date()).toISOString(),
    });

    const [total, fees, futureEarnings] = await Promise.all([
      this.payablesRepository
        .createQueryBuilder('entity')
        .select('sum(entity.total)', 'total')
        .where('entity.merchantId = :merchantId', {
          merchantId,
        })
        .andWhere('entity.createdAt >= :startDate', {
          startDate,
        })
        .andWhere('entity.createdAt <= :endDate', {
          endDate,
        })
        .andWhere('entity.status = :status', {
          status: PayableStatusEnum.PAID,
        })
        .getRawOne(),
      this.payablesRepository
        .createQueryBuilder('entity')
        .select('sum(entity.discount)', 'total')
        .where('entity.merchantId = :merchantId', {
          merchantId,
        })
        .andWhere('entity.createdAt >= :startDate', {
          startDate,
        })
        .andWhere('entity.createdAt <= :endDate', {
          endDate,
        })
        .andWhere('entity.status = :status', {
          status: PayableStatusEnum.PAID,
        })
        .getRawOne(),
      this.payablesRepository
        .createQueryBuilder('entity')
        .select('sum(entity.total)', 'total')
        .where('entity.merchantId = :merchantId', {
          merchantId,
        })
        .andWhere('entity.createdAt >= :startDate', {
          startDate,
        })
        .andWhere('entity.createdAt <= :endDate', {
          endDate,
        })
        .andWhere('entity.status = :status', {
          status: PayableStatusEnum.WAITING_FUNDS,
        })
        .getRawOne(),
    ]);

    return {
      totalPaid: parseFloat(total.total) || 0,
      feePaid: parseFloat(fees.total) || 0,
      futureEarnings: parseFloat(futureEarnings.total) || 0,
    };
  }

  private validateBetweenDates = ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }): { startDate: Date; endDate: Date } => {
    const startDateOfDay = startOfDay(new Date(startDate));
    const endDateOfDay = endOfDay(addDays(new Date(endDate), 1));

    if (!isBefore(startDateOfDay, endDateOfDay)) {
      throw new HttpException(
        'A data de inicio deve ser menor que a data final',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { startDate: startDateOfDay, endDate: endDateOfDay };
  };
}
