import IPayableService, {
  CreatePayableDTO,
  GroupedResponse,
} from '@services/IPayableService';
import { injectable, inject } from 'tsyringe';
import AppError from '@errors/AppError';
import IMerchantRepository from '@domain/IMerchantRepository';
import IPayableRepository from '@domain/IPayableRepository';
import Payable from '@domain/Payable';
import { NOT_FOUND } from 'http-status';
import logger from '@infra/logger';
import { PayableFactory, PayableStatus } from '../factories/PayableFactory';
import { PayableCalculator } from '../strategy/PayableCalculator';

@injectable()
class PayableService implements IPayableService {
  constructor(
    @inject('MerchantRepository')
    private merchantRepository: IMerchantRepository,

    @inject('PayableRepository')
    private payableRepository: IPayableRepository,

    @inject('PayableFactory')
    private payableFactory: PayableFactory,

    @inject('PayableCalculator')
    private payableCalculator: PayableCalculator,
  ) {}

  async create(createPayableDTO: CreatePayableDTO): Promise<Payable> {
    const merchant = await this.merchantRepository.findById(
      createPayableDTO.merchant_id,
      createPayableDTO.tx,
    );

    if (!merchant) {
      throw new AppError('Merchant not found', NOT_FOUND);
    }

    const payable = this.payableFactory.createPayableFromDTO(createPayableDTO);

    const insertedPayable = await this.payableRepository.create(
      payable,
      createPayableDTO.tx,
    );

    logger.info('Created payable');
    return insertedPayable;
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

    const totalFuture = this.payableCalculator.calculateTotalByStatus(
      payablesInPeriod,
      PayableStatus.WAITING_FUNDS,
    );
    const { totalPaid, totalPaidDiscounted } =
      this.payableCalculator.calculatePaidTotals(payablesInPeriod);

    return {
      totalPaidDiscounted,
      totalPaid,
      totalFuture,
    };
  }
}

export default PayableService;
