import Redis from 'ioredis';
import { env } from '@/config/env';

export const CacheClient = new Redis(env.CACHE_URL, {
  retryStrategy: (times) => (times >= 2 ? null : 2000),
});
