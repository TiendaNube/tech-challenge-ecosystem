import { Prisma } from '@prisma/client';
import Payable, { GroupedPayable } from './Payable';

export default interface IPayableRepository {
  totalInPeriodByMerchantId(
    merchant_id: number,
    from_date: string,
    to_date: string,
  ): Promise<GroupedPayable[]>;

  create(
    payable: Payable,
    tx: Prisma.TransactionClient | null,
  ): Promise<Payable>;
}
