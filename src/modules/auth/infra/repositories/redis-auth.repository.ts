import { Injectable } from '@nestjs/common';
import {
  AuthTokenCacheRepository,
  SessionData,
} from '@/modules/auth/domain/repositories/auth-token-cache.repository';
import { RedisClientRepository } from '@/modules/auth/domain/repositories/redis-client.repository';

@Injectable()
export class RedisAuthTokenCacheRepository implements AuthTokenCacheRepository {
  constructor(private readonly redisClientRepository: RedisClientRepository) {}

  async setToken(token: string, data: unknown, ttl: number): Promise<void> {
    await this.redisClientRepository
      .getClient()
      .set(token, JSON.stringify(data), { EX: ttl });
  }

  async getToken<T = unknown>(token: string): Promise<T | null> {
    const value = await this.redisClientRepository.getClient().get(token);
    return value ? (JSON.parse(value) as T) : null;
  }

  async deleteToken(token: string): Promise<void> {
    await this.redisClientRepository.getClient().del(token);
  }

  async setSession(
    userId: string,
    data: SessionData,
    ttl: number,
  ): Promise<void> {
    await this.redisClientRepository
      .getClient()
      .set(`session:${userId}`, JSON.stringify(data), { EX: ttl });
  }

  async getSession(userId: string): Promise<SessionData | null> {
    const value = await this.redisClientRepository
      .getClient()
      .get(`session:${userId}`);
    return value ? (JSON.parse(value) as SessionData) : null;
  }

  async deleteSession(userId: string): Promise<void> {
    await this.redisClientRepository.getClient().del(`session:${userId}`);
  }

  async addToBlacklist(token: string, ttl: number): Promise<void> {
    await this.redisClientRepository
      .getClient()
      .set(`blacklist:${token}`, '1', { EX: ttl });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const exists = await this.redisClientRepository
      .getClient()
      .exists(`blacklist:${token}`);
    return exists === 1;
  }
}
