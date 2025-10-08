import { Inject, Injectable } from '@nestjs/common';
import {
  AbstractAuthTokenCacheReadRepository,
  SessionData,
} from '@/modules/auth/domain/repositories/auth-token-cache.read-repository';
import { REDIS_CLIENT } from '@/shared/infra/config/redis.config';
import Redis from 'ioredis';

@Injectable()
export class RedisAuthTokenCacheQueryRepository
  implements AbstractAuthTokenCacheReadRepository
{
  private systemName = 'TaskManager:Auth';

  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  private refreshKey(refreshToken: string) {
    return `${this.systemName}:refresh:${refreshToken}`;
  }

  private sessionKey(userId: string) {
    return `${this.systemName}:session:${userId}`;
  }

  private blacklistKey(token: string) {
    return `${this.systemName}:blacklist:${token}`;
  }

  async getUserIdByToken(refreshToken: string): Promise<string | null> {
    return (await this.client.get(this.refreshKey(refreshToken))) || null;
  }

  async getSession(userId: string): Promise<SessionData | null> {
    const data = await this.client.get(this.sessionKey(userId));
    return data ? (JSON.parse(data) as SessionData) : null;
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return (await this.client.exists(this.blacklistKey(token))) > 0;
  }
}
