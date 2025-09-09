import { Inject, Injectable } from '@nestjs/common';
import {
  AuthTokenCacheWriteRepository,
  SessionData,
} from '@/modules/auth/domain/repositories/auth-token-cache.write-repository';
import { REDIS_CLIENT } from '@/shared/infra/config/redis.config';
import Redis from 'ioredis';

@Injectable()
export class RedisAuthTokenCommandCacheRepository implements AuthTokenCacheWriteRepository {
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

  async setRefreshToken(
    refreshToken: string,
    userId: string,
    ttl: number,
  ): Promise<void> {
    await this.client.set(this.refreshKey(refreshToken), userId, 'EX', ttl);
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.client.del(this.refreshKey(refreshToken));
  }

  async setSession(
    userId: string,
    data: SessionData,
    ttl: number,
  ): Promise<void> {
    await this.client.set(
      this.sessionKey(userId),
      JSON.stringify(data),
      'EX',
      ttl,
    );
  }

  async deleteSession(userId: string): Promise<void> {
    await this.client.del(this.sessionKey(userId));
  }

  async addToBlacklist(token: string, ttl: number): Promise<void> {
    await this.client.set(this.blacklistKey(token), 'true', 'EX', ttl);
  }
}
