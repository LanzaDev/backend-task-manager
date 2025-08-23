import { GetHealthOutputDTO } from '@/modules/app/application/dto/get-health-output.dto';

export class HealthMapper {
  static toOutput(params: {
    dbStatus: 'health' | 'unhealth';
  }): GetHealthOutputDTO {
    const { dbStatus } = params;

    const status = 'health';

    return new GetHealthOutputDTO({
      status,
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-br', {
        timeZone: 'America/Sao_paulo',
      }),
    });
  }
}
