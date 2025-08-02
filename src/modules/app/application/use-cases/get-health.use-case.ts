import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { GetHealthOutputDTO } from '@/modules/app/application/dtos/get-health-output.dto';

@Injectable()
export class GetHealthUseCase {
  constructor(private readonly databaseRepository: DatabaseRepository) {}

  async execute(): Promise<GetHealthOutputDTO> {
    let dbStatus: 'health' | 'unhealth' = 'unhealth';

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
