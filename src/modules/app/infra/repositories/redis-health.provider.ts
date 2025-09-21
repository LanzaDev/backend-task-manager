import { Injectable } from '@nestjs/common';
import { DatabaseHealthRepository } from '../../domain/repositories/database-health.repository';
import { RedisService } from '@/shared/infra/cache/redis/redis.service';

@Injectable()
export class RedisHealthRepository implements DatabaseHealthRepository {
  constructor(private readonly redis: RedisService) {}
  async checkConnection(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.log(
        'cache connection error: ',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }
}
