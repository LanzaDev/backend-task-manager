import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { ResponseHealthDTO } from '@/modules/app/application/dto/output/response-health.dto';
import { CacheRepository } from '@/modules/app/domain/providers/cache.provider';

@Injectable()
export class CheckHealthUseCase {
  constructor(
    private readonly databaseRepository: DatabaseRepository,
    private readonly cacheRepository: CacheRepository,
  ) {}

  async execute(): Promise<ResponseHealthDTO> {
    let dbStatus: 'health' | 'unhealthy' = 'unhealthy';
    let cacheStatus: 'health' | 'unhealthy' = 'unhealthy';

    try {
      const dbCheck = await this.databaseRepository.checkDatabaseConnection();
      if (dbCheck) {
        dbStatus = 'health';
      }
    } catch (error) {
      console.error('DB connection failed: ', error);
    }

    try {
      const cacheCheck = await this.cacheRepository.checkCacheConnection();
      if (cacheCheck) {
        cacheStatus = 'health';
      }
    } catch (error) {
      console.error('Cache connection failed: ', error);
    }

    return {
      status: 'health',
      cache: cacheStatus,
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-br', {
        timeZone: 'America/Sao_paulo',
      }),
    };
  }
}
