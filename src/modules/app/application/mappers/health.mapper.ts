import { ResponseHealthDTO } from '../dto/output/response-health.dto';

export class HealthMapper {
  static toOutput(params: {
    dbStatus: 'health' | 'unhealthy';
  }): ResponseHealthDTO {
    const { dbStatus } = params;

    const status = 'health';

    return new ResponseHealthDTO({
      status,
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-br', {
        timeZone: 'America/Sao_paulo',
      }),
    });
  }
}
