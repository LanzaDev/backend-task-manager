import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/core/domain/repositories/cache.repository';
import { CacheClient } from '../../config/redis.config';
import { plainToInstance } from 'class-transformer';
import { MetaInputVO } from '@/shared/domain/value-objects/meta-input.vo';

@Injectable()
export class RedisCacheRepository<V extends object> extends CacheRepository<V> {
  private client = CacheClient;
  private systemName = 'new ad backend';

  private buildUniqueKey(key: string): string {
    return `${this.systemName}:${this.name}:unique:${key}`;
  }

  private buildListKey(meta: MetaInputVO<string>): string {
    return `${this.systemName}:${this.name}:list:${JSON.stringify(meta)}`;
  }
  async set(key: string, value: V): Promise<void> {
    await this.delLists();
    await this.client.setex(
      this.buildUniqueKey(key),
      this.ttl,
      JSON.stringify(value),
    );
  }
  async get(key: string): Promise<V> {
    const data = await this.client.get(this.buildUniqueKey(key));
    if (!data) {
      throw new Error(`Resource not cached: ${key}`);
    }
    return plainToInstance(this.classConstructor, JSON.parse(data));
  }
  async del(key: string): Promise<void> {
    await this.delLists();
    await this.client.del(this.buildUniqueKey(key));
  }
  async setList(options: MetaInputVO<string>, value: V[]): Promise<void> {
    await this.client.setex(
      this.buildListKey(options),
      this.ttl,
      JSON.stringify(value),
    );
  }

  async getList(options: MetaInputVO<string>): Promise<V[]> {
    const data = await this.client.get(this.buildListKey(options));
    if (!data) {
      throw new Error(`Resource not cached!`);
    }
    const list = JSON.parse(data) as object[];
    return list.map((v) => plainToInstance(this.classConstructor, v));
  }

  async delLists(): Promise<void> {
    const pattern = `${this.systemName}:${this.name}:list:*`;
    let cursor = '0';
    do {
      const [newCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = newCursor;
      if (keys.length) {
        await this.client.del(...keys);
      }
    } while (cursor !== '0');
  }
}
