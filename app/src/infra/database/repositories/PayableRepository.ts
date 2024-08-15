import IPayableRepository from '@domain/IPayableRepository';
import { PrismaClient, Prisma } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import * as _ from 'lodash';
import Payable, { GroupedPayable } from '@domain/Payable';
import ICacheProvider from '@providers/CacheProvider/ICacheProvider';

const CACHE_TTL = 60;

@injectable()
class PayableRepository implements IPayableRepository {
  constructor(
    @inject('Database')
    private database: PrismaClient,

    @inject('CacheProvider')
    private cache: ICacheProvider,
  ) {}

  async create(payable: Payable): Promise<Payable> {
    return await this.database.payable.create({
      data: payable,
    });
  }

  async totalInPeriodByMerchantId(
    merchant_id: number,
    from_date: string,
    to_date: string,
  ): Promise<GroupedPayable[]> {
    const cacheKey = `total-dates-merchant-${merchant_id}-${from_date.toString()}-${to_date.toString()}`;
    const inCache = await this.cache.get(cacheKey);

    if (inCache) {
      return inCache as unknown as GroupedPayable[];
    }

    const result: GroupedPayable[] = await this.database.$queryRaw(
      Prisma.sql`SELECT status, sum(total) as total, sum(discount) as total_discount FROM payable p 
        WHERE p.merchant_id = ${merchant_id} AND create_date >=  TO_TIMESTAMP(${from_date}, 'YYYY-MM-DD') 
        AND create_date <= TO_TIMESTAMP(${to_date}, 'YYYY-MM-DD') 
        GROUP BY p.status `,
    );

    await this.cache.set(cacheKey, result, CACHE_TTL);

    return result;
  }
}

export default PayableRepository;
