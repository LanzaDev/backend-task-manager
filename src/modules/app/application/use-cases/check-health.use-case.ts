import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { ResponseHealthDTO } from '../dto/output/response-health.dto';

@Injectable()
export class CheckHealthUseCase {
  constructor(private readonly databaseRepository: DatabaseRepository) {}

  async execute(): Promise<ResponseHealthDTO> {
    let dbStatus: 'health' | 'unhealthy' = 'unhealthy';

    try {
      const dbCheck = await this.databaseRepository.checkDatabaseConnection();
      if (dbCheck) {
        dbStatus = 'health';
      }
    } catch (error) {
      console.error('DB connection failed: ', error);
    }

    return {
      status: 'health',
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-br', {
        timeZone: 'America/Sao_paulo',
      }),
    };
  }
}
