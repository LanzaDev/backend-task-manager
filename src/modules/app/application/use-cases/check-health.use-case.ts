import { Injectable } from '@nestjs/common';
import { ResponseHealthDTO } from '@/modules/app/presentation/dto/output/response-health.dto';
import { CacheHealthRepository } from '../../domain/repositories/cache-health.repository';
import { DatabaseHealthRepository } from '../../domain/repositories/database-health.repository';

@Injectable()
export class CheckHealthUseCase {
  constructor(
    private readonly databaseHealthRepository: DatabaseHealthRepository,
    private readonly cacheHealthRepository: CacheHealthRepository,
  ) {}

  async execute(): Promise<ResponseHealthDTO> {
    const [isDbOnline, isCacheOnline ] = await Promise.all([
      this.databaseHealthRepository.checkConnection(),
      this.cacheHealthRepository.checkConnection(),
    ]);

    const response: ResponseHealthDTO = {
      status: isDbOnline && isCacheOnline ? 'healthy' : 'unhealthy',
      database: isDbOnline ? 'healthy' : 'unhealthy',
      cache: isCacheOnline ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };

    return response;
  }
}
