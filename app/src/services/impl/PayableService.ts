import IPayableService, {
  CreatePayableDTO,
  GroupedResponse,
} from '@services/IPayableService';
import { injectable, inject } from 'tsyringe';
import * as _ from 'lodash';
import AppError from '@errors/AppError';
import IMerchantRepository from '@domain/IMerchantRepository';
import IPayableRepository from '@domain/IPayableRepository';
import Payable from '@domain/Payable';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import logger from '@infra/logger';
import { PaymentMethod } from '@domain/Transaction';

enum PayableStatus {
  PAID = 'paid',
  WAITING_FUNDS = 'waiting_funds',
}

enum Discount {
  CREDIT_CARD = 4,
  DEBIT_CARD = 2,
}

const ADD_DAYS_QUANTITY = 30;

@injectable()
class PayableService implements IPayableService {
  constructor(
    @inject('MerchantRepository')
    private merchantRepository: IMerchantRepository,

    @inject('PayableRepository')
    private payableRepository: IPayableRepository,
  ) {}

  async create(createPayableDTO: CreatePayableDTO): Promise<Payable> {
    const merchant = await this.merchantRepository.findById(
      createPayableDTO.merchant_id,
    );

    if (!merchant) {
      throw new AppError('Not found merchant', NOT_FOUND);
    }

    const payable: Partial<Payable> = {};

    payable.merchant_id = createPayableDTO.merchant_id;

    const date = new Date();

    logger.info('Payable DTO', createPayableDTO);

    if (createPayableDTO.payment_method === PaymentMethod.DEBIT_CARD) {
      payable.status = PayableStatus.PAID;
      payable.discount = Discount.DEBIT_CARD;
    } else if (createPayableDTO.payment_method === PaymentMethod.CREDIT_CARD) {
      payable.status = PayableStatus.WAITING_FUNDS;
      date.setDate(date.getDate() + ADD_DAYS_QUANTITY);
      payable.discount = Discount.CREDIT_CARD;
    } else {
      throw new AppError('Not found payment method', INTERNAL_SERVER_ERROR);
    }

    payable.create_date = date;
    payable.subtotal = createPayableDTO.total;
    payable.discount = createPayableDTO.total * (payable.discount / 100);
    payable.total =
      createPayableDTO.total -
      createPayableDTO.total * (payable.discount / 100);

    const insertedPayable = await this.payableRepository.create(
      payable as Payable,
    );

    return insertedPayable;
  }

  async totalInPeriodByMerchantId(
    merchant_id: number,
    from_date: string,
    to_date: string,
  ): Promise<AppError | GroupedResponse | Error> {
    const merchant = await this.merchantRepository.findById(merchant_id);

    if (!merchant) {
      throw new AppError('Not found merchant', NOT_FOUND);
    }

    const totalInPeriodByMerchantId =
      await this.payableRepository.totalInPeriodByMerchantId(
        merchant_id,
        from_date,
        to_date,
      );

    let totalFuture = 0;
    let totalPaid = 0;
    let totalPaidDiscounted = 0;

    const fundsToReceive = totalInPeriodByMerchantId.filter(
      item => item.status === PayableStatus.WAITING_FUNDS,
    );

    if (fundsToReceive) {
      totalFuture = fundsToReceive[0].total;
    }

    const fundsPaid = totalInPeriodByMerchantId.filter(
      item => item.status === PayableStatus.PAID,
    );

    if (fundsPaid) {
      totalPaid = fundsPaid[0].total;
      totalPaidDiscounted = fundsPaid[0].total_discount;
    }

    return {
      totalPaidDiscounted,
      totalPaid,
      totalFuture,
    };
  }
}

export default PayableService;
