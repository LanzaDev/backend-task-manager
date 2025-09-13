import { HealthStatus } from '@/shared/types/health-status.type';
import { Expose } from 'class-transformer';

export class ResponseHealthDTO {
  @Expose()
  status: HealthStatus;

  @Expose()
  cache: HealthStatus;

  @Expose()
  database: HealthStatus;

  @Expose()
  timestamp: string;

  constructor(props: ResponseHealthDTO) {
    Object.assign(this, props);
  }
}
