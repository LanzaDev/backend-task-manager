import { CacheRepository } from '@/modules/app/domain/providers/cache.provider';
import { RedisService } from '@/shared/infra/cache/redis/redis.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisHealthRepository implements CacheRepository {
  constructor(private readonly redisService: RedisService) {}
  async checkCacheConnection(): Promise<boolean> {
    try {
      await this.redisService.ping();
      return true;
    } catch (error) {
      console.log('cache connection error: ', error);
      return false;
    }
  }
}
