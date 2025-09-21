import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { HealthStatus } from '@/shared/types/health-status.type';

export class ResponseHealthDTO {
  @Expose()
  @ApiProperty({
    example: 'healthy',
    description: 'Overall application health status',
  })
  status: HealthStatus;

  @Expose()
  @ApiProperty({ example: 'healthy', description: 'Cache health status' })
  cache: HealthStatus;

  @Expose()
  @ApiProperty({ example: 'healthy', description: 'Database health status' })
  database: HealthStatus;

  @Expose()
  @ApiProperty({
    example: '2025-09-21T12:00:00.000Z',
    description: 'Timestamp of the health check',
  })
  timestamp: string;

  constructor(props: Partial<ResponseHealthDTO>) {
    Object.assign(this, props);
  }
}
