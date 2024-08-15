import ICacheProvider from '../../providers/CacheProvider/ICacheProvider';
import config from '@config/cache';
import asyncRedis from 'async-redis';
import AppError from '@errors/AppError';

class RedisCacheProvider implements ICacheProvider {
  private client: any;

  constructor() {
    // @ts-ignore
    this.client = asyncRedis.createClient(config.redis);

    this.client.on('error', (error: unknown) => {
      throw new AppError(`Redis client error: ${error}`);
    });
  }

  async set(
    key: string,
    value: unknown,
    expiresSeconds?: number,
  ): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', expiresSeconds);
  }

  async get(key: string): Promise<unknown | undefined> {
    const value = await this.client.get(key);

    return JSON.parse(value);
  }
}

export default RedisCacheProvider;
