import { ClassConstructor } from 'class-transformer';
import { MetaInputVO } from '@/shared/domain/value-objects/meta-input.vo';
import { env } from '@/config/env';

export abstract class CacheRepository<V = unknown> {
  protected ttl: number;

  constructor(
    protected name: string,
    protected classConstructor: ClassConstructor<V>,
    ttl?: number,
  ) {
    this.ttl = ttl || env.CACHE_TTL;
  }

  abstract set(key: string, value: V): Promise<void>;
  abstract setList(options: MetaInputVO<string>, value: V[]): Promise<void>;

  abstract get(key: string): Promise<V>;
  abstract getList(options: MetaInputVO<string>): Promise<V[]>;

  abstract del(key: string): Promise<void>;
  abstract delLists(): Promise<void>;
}
