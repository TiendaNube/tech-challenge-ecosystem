import IPayableService, {
  CreatePayableDTO,
  GroupedResponse,
} from '@services/IPayableService';
import { injectable, inject } from 'tsyringe';
import * as _ from 'lodash';
import AppError from '@errors/AppError';
import IMerchantRepository from '@domain/IMerchantRepository';
import IPayableRepository from '@domain/IPayableRepository';
import Payable, { GroupedPayable } from '@domain/Payable';
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
      createPayableDTO.tx,
    );

    if (!merchant) {
      throw new AppError('Merchant not found', NOT_FOUND);
    }

    const payable = this.createPayableFromDTO(createPayableDTO);

    const insertedPayable = await this.payableRepository.create(
      payable,
      createPayableDTO.tx,
    );

    logger.info('Created payable');
    return insertedPayable;
  }

  private createPayableFromDTO(createPayableDTO: CreatePayableDTO): Payable {
    const payable: Partial<Payable> = {
      merchant_id: createPayableDTO.merchant_id,
      create_date: new Date(),
      subtotal: createPayableDTO.total,
    };

    switch (createPayableDTO.payment_method) {
      case PaymentMethod.DEBIT_CARD:
        payable.status = PayableStatus.PAID;
        payable.discount = Discount.DEBIT_CARD;
        break;
      case PaymentMethod.CREDIT_CARD:
        payable.status = PayableStatus.WAITING_FUNDS;
        payable.discount = Discount.CREDIT_CARD;
        payable.create_date?.setDate(
          payable.create_date.getDate() + ADD_DAYS_QUANTITY,
        );
        break;
      default:
        throw new AppError('Invalid payment method', INTERNAL_SERVER_ERROR);
    }

    payable.discount = createPayableDTO.total * (payable.discount / 100);
    payable.total = createPayableDTO.total - payable.discount;

    return payable as Payable;
  }

  async totalInPeriodByMerchantId(
    merchant_id: number,
    from_date: string,
    to_date: string,
  ): Promise<GroupedResponse> {
    const merchant = await this.merchantRepository.findById(merchant_id);

    if (!merchant) {
      throw new AppError('Merchant not found', NOT_FOUND);
    }

    const payablesInPeriod =
      await this.payableRepository.totalInPeriodByMerchantId(
        merchant_id,
        from_date,
        to_date,
      );

    const totalFuture = this.calculateTotalByStatus(
      payablesInPeriod,
      PayableStatus.WAITING_FUNDS,
    );
    const { totalPaid, totalPaidDiscounted } =
      this.calculatePaidTotals(payablesInPeriod);

    return {
      totalPaidDiscounted,
      totalPaid,
      totalFuture,
    };
  }

  private calculateTotalByStatus(
    payables: GroupedPayable[],
    status: PayableStatus,
  ): number {
    const payablesWithStatus = payables.filter(item => item.status === status);
    return payablesWithStatus.length > 0
      ? Number(payablesWithStatus[0].total.toFixed(2))
      : 0;
  }

  private calculatePaidTotals(payables: GroupedPayable[]): {
    totalPaid: number;
    totalPaidDiscounted: number;
  } {
    const paidPayables = payables.filter(
      item => item.status === PayableStatus.PAID,
    );

    if (paidPayables.length > 0) {
      const totalPaid = Number(paidPayables[0].total.toFixed(2));
      const totalPaidDiscounted = Number(
        paidPayables[0].total_discount.toFixed(2),
      );
      return { totalPaid, totalPaidDiscounted };
    }

    return { totalPaid: 0, totalPaidDiscounted: 0 };
  }
}

export default PayableService;
