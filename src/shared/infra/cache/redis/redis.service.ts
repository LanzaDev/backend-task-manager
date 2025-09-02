import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from '@/config/env';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    super({
      host: env.CACHE_HOST,
      port: env.CACHE_PORT,
      db: env.CACHE_DB,
    });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
