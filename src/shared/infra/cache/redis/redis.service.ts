import { env } from '@/config/env';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor() {
    super({
      host: env.CACHE_HOST,
      port: env.CACHE_PORT,
      password: env.CACHE_PASSWORD,
      db: env.CACHE_DB,
    });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
