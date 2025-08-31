import { ResponseHealthDTO } from '@/modules/app/application/dto/output/response-health.dto';

export class HealthMapper {
  static toOutput(params: {
    dbStatus: 'health' | 'unhealthy';
    cacheStatus: 'health' | 'unhealthy';
  }): ResponseHealthDTO {
    const { dbStatus, cacheStatus } = params;

    const status = 'health';

    return new ResponseHealthDTO({
      status,
      cache: cacheStatus,
      database: dbStatus,
      timestamp: new Date().toLocaleString('pt-br', {
        timeZone: 'America/Sao_paulo',
      }),
    });
  }
}
