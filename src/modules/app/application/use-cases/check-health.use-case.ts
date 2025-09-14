import { Injectable, Logger } from '@nestjs/common';
import { ResponseHealthDTO } from '@/modules/app/presentation/dto/output/response-health.dto';
import { HealthRepository } from '@/modules/app/domain/repositories/health.repository';
import { HealthStatus } from '@/shared/types/health-status.type';

@Injectable()
export class CheckHealthUseCase {
  private readonly logger = new Logger(CheckHealthUseCase.name);

  constructor(private readonly healthRepository: HealthRepository) {}

  async execute(): Promise<ResponseHealthDTO> {
    let dbStatus: HealthStatus = 'unhealthy';
    let cacheStatus: HealthStatus = 'unhealthy';

    try {
      if (await this.healthRepository.checkConnection()) {
        dbStatus = 'healthy';
      }
    } catch (error) {
      this.logger.error(
        `DB connection failed: ${error.message}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    try {
      if (await this.healthRepository.checkConnection()) {
        cacheStatus = 'healthy';
      }
    } catch (error) {
      this.logger.error(
        `Cache connection failed: ${error.message}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    const overallStatus: HealthStatus =
      dbStatus === 'healthy' && cacheStatus === 'healthy'
        ? 'healthy'
        : 'unhealthy';

    return {
      status: overallStatus,
      cache: cacheStatus,
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-br', {
        timeZone: 'America/Sao_paulo',
      }),
    };
  }
}
