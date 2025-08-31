import { CacheRepository } from '@/modules/app/domain/providers/cache.provider';
import { RedisCacheRepository } from './redis/redis-cache.provider';
import { RedisService } from './redis/redis.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
    RedisService,
  ],
  exports: [RedisService, CacheRepository],
})
export class CacheModule {}
