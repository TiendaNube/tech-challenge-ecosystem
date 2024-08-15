import Payable, { GroupedPayable } from '@domain/Payable';
import AppError from '@errors/AppError';

export interface CreatePayableDTO {
  merchant_id: number;
  total: number;
  payment_method: string;
}

export default interface IPayableService {
  totalInPeriodByMerchantId(
    merchant_id: number,
    from_date: string,
    to_date: string,
  ): Promise<GroupedPayable[] | AppError | Error>;

  create(createPayableDTO: CreatePayableDTO): Promise<Payable>;
}
