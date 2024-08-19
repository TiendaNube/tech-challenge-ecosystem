import IMerchantRepository from '@domain/IMerchantRepository';
import Merchant from '@domain/Merchant';
import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@providers/CacheProvider/ICacheProvider';

const CACHE_TTL = 120;

@injectable()
class MerchantRepository implements IMerchantRepository {
  constructor(
    @inject('Database')
    private database: PrismaClient,

    @inject('CacheProvider')
    private cache: ICacheProvider,
  ) {}

  async findById(
    id: number,
    tx: Prisma.TransactionClient | undefined = undefined,
  ): Promise<Merchant | null> {
    const connection = tx || this.database;

    const cacheKey = `merchant-${id}`;
    const inCache = await this.cache.get(cacheKey);

    if (inCache) {
      return inCache as unknown as Merchant;
    }

    const result = await connection.merchant.findFirst({
      where: { id },
      select: { id: true, name: true },
    });

    if (result) {
      await this.cache.set(cacheKey, result, CACHE_TTL);
    }

    return result;
  }
}

export default MerchantRepository;
