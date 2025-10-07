import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';
import { ResponseHealthDTO } from '../dto/output/response-health.dto';

@ApiTags('Health')
@ApiExtraModels(ResponseHealthDTO)
@Controller()
export class CheckApiHealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Check application health',
    description:
      'Returns the health status of the app and its dependencies (API, Database, Cache, Ia).',
  })
  @ApiOkResponse({
    description: 'Application and dependencies are healthy',
    type: ResponseHealthDTO,
  })
  @ApiServiceUnavailableResponse({
    description: 'Degraded mode: cache dependencies are down',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(ResponseHealthDTO) },
        example: {
          cacheDown: {
            summary: 'Cache offline',
            value: {
              status: 'unhealthy',
              cache: 'unhealthy',
              database: 'healthy',
              timestamp: '2025-09-21T12:00:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description:
      'Critical failure: database is down or all dependencies are down',
    content: {
      'application/json': {
        schema: { $ref: getSchemaPath(ResponseHealthDTO) },
        examples: {
          databaseDown: {
            summary: 'Database offline (API unavailable)',
            value: {
              status: 'unhealthy',
              cache: 'healthy',
              database: 'unhealthy',
              timestamp: '2025-09-21T12:00:00.000Z',
            },
          },
          allDown: {
            summary: 'All dependencies offline',
            value: {
              status: 'unhealthy',
              cache: 'unhealthy',
              database: 'unhealthy',
              timestamp: '2025-09-21T12:00:00.000Z',
            },
          },
        },
      },
    },
  })
  async checkHealth() {
    return await this.checkHealthUseCase.execute();
  }
}
