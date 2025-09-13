import { Module } from '@nestjs/common';
import { CacheRepository } from '@/core/domain/repositories/cache.repository';
import { RedisCacheRepository } from './redis/redis-cache.provider';
import { RedisService } from './redis/redis.service';
import Redis from 'ioredis';
import { REDIS_CLIENT, RedisProvider } from '../config/redis.config';

@Module({
  providers: [
    RedisProvider,
    {
      provide: CacheRepository,
      useFactory: (client: Redis) => {
        return new RedisCacheRepository(client, 'CacheRepository', Object);
      },
      inject: [REDIS_CLIENT],
    },
    RedisService,
  ],
  exports: [RedisService, CacheRepository, RedisProvider],
})
export class CacheModule {}
