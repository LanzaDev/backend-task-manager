import { Injectable } from '@nestjs/common';
import {
  AuthTokenCacheRepository,
  SessionData,
} from '@/modules/auth/domain/repositories/auth-token-cache.repository';
import { CacheClient } from '@/shared/infra/config/redis.config';

@Injectable()
export class RedisAuthTokenCacheRepository implements AuthTokenCacheRepository {
  private client = CacheClient;
  private systemName = 'TaskManager:Auth';

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

  async setRefreshToken(refreshToken: string, userId: string, ttl: number): Promise<void> {
    await this.client.set(this.refreshKey(refreshToken), userId, 'EX', ttl);
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.client.del(this.refreshKey(refreshToken));
  }

  async setSession(userId: string, data: SessionData, ttl: number): Promise<void> {
    await this.client.set(this.sessionKey(userId), JSON.stringify(data), 'EX', ttl);
  }

  async getSession(userId: string): Promise<SessionData | null> {
    const data = await this.client.get(this.sessionKey(userId));
    return data ? JSON.parse(data) : null;
  }

  async deleteSession(userId: string): Promise<void> {
    await this.client.del(this.sessionKey(userId));
  }

  async addToBlacklist(token: string, ttl: number): Promise<void> {
    await this.client.set(this.blacklistKey(token), 'true', 'EX', ttl);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return (await this.client.exists(this.blacklistKey(token))) > 0;
  }
}
