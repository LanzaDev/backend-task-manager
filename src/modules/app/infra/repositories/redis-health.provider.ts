import { Injectable } from '@nestjs/common';
import { HealthRepository } from '@/modules/app/domain/repositories/health.repository';
import { RedisService } from '@/shared/infra/cache/redis/redis.service';

@Injectable()
export class RedisHealthRepository implements HealthRepository {
  constructor(private readonly redis: RedisService) {}
  async check(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      console.log(
        'cache connection error: ',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }
}
