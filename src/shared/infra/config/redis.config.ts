import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from '@/config/env';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: () => {
    return new Redis(env.CACHE_URL, {
      retryStrategy: (times) => (times >= 2 ? null : 2000),
    });
  },
};
