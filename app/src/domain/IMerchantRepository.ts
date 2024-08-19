import { Prisma } from '@prisma/client';
import Merchant from './Merchant';

export default interface IMerchantRepository {
  findById(
    id: number,
    tx?: Prisma.TransactionClient | null,
  ): Promise<Merchant | null>;
}
