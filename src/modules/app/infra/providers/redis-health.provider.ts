import { Injectable } from '@nestjs/common';
import { CacheRepository } from '@/modules/app/domain/providers/cache.provider';
import { RedisService } from '@/shared/infra/cache/redis/redis.service';

@Injectable()
export class RedisHealthRepository implements CacheRepository {
  constructor(private readonly redis: RedisService) {}
  async checkCacheConnection(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      console.log(
        'cache connection error: ',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }
}
