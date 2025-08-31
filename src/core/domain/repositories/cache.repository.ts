import { ClassConstructor } from 'class-transformer';
import { env } from '@/config/env';
import { MetaInputVO } from '@/shared/domain/value-objects/meta-input.vo'; // Representa um objeto de valor que serve para controle de filtro de listas nos repositories

export abstract class CacheRepository<V extends object> {
  // Abstração do provider de cache
  protected ttl: number;

  constructor(
    protected name: string, // Representa o nome do recurso que está sendo cacheado
    protected classConstructor: ClassConstructor<V>, // Representa o construtor da classe do objeto a ser armazenado (dê preferência por usar DTO). Isso serve para garantir a tipagem correta do cache
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
