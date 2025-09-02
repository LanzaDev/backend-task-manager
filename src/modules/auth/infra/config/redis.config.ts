import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { env } from '@/config/env';
import { RedisClientRepository } from '@/modules/auth/domain/repositories/redis-client.repository';

@Injectable()
export class RedisClient implements RedisClientRepository {
  private client: RedisClientType = createClient({
    socket: {
      host: env.CACHE_HOST,
      port: env.CACHE_PORT,
    },
  });

  constructor() {
    this.client.connect().catch(console.error);
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
