import Payable from '@domain/Payable';
import AppError from '@errors/AppError';
import { Prisma } from '@prisma/client';

export interface GroupedResponse {
  totalFuture: number;
  totalPaidDiscounted: number;
  totalPaid: number;
}

export interface CreatePayableDTO {
  merchant_id: number;
  total: number;
  transaction_date: Date;
  payment_method: string;
  tx?: Prisma.TransactionClient;
}

export default interface IPayableService {
  totalInPeriodByMerchantId(
    merchant_id: number,
    from_date: string,
    to_date: string,
  ): Promise<GroupedResponse | AppError | Error>;

  create(createPayableDTO: CreatePayableDTO): Promise<Payable>;
}
