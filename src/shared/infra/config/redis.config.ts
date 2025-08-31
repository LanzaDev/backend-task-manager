import Redis from 'ioredis';

import { env } from '@/config/env';

export const CacheClient = new Redis(env.CACHE_URL, {
  retryStrategy: (times) => {
    if (times >= 2) return null;
    return 2000;
  },
});
