import { Injectable, Logger } from '@nestjs/common';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { ResponseHealthDTO } from '@/modules/app/application/dto/output/response-health.dto';
import { CacheRepository } from '@/modules/app/domain/providers/cache.provider';

@Injectable()
export class CheckHealthUseCase {
  private readonly logger = new Logger(CheckHealthUseCase.name);

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
      this.logger.error(`DB connection failed: ${error.message}`, error instanceof Error ? error.stack : String(error));
    }

    try {
      const cacheCheck = await this.cacheRepository.checkCacheConnection();
      if (cacheCheck) {
        cacheStatus = 'health';
      }
    } catch (error) {
      this.logger.error(`Cache connection failed: ${error.message}`, error instanceof Error ? error.stack : String(error));
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
