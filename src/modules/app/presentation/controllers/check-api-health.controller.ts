import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CheckHealthUseCase } from '@/modules/app/application/use-cases/check-health.use-case';

@ApiTags('Health')
@Controller()
export class CheckApiHealthController {
  constructor(private readonly checkHealthUseCase: CheckHealthUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Check application health',
    description:
      'Returns the health status of the app and its dependencies (PostgreSQL).',
  })
  @ApiOkResponse({
    description: 'Application and dependencies are healthy',
  })
  @ApiServiceUnavailableResponse({
    description: 'One or more dependencies are down',
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected internal error occurred',
    schema: {
      example: {
        status: 'unhealthy',
        message: 'INTERNAL SERVER ERROR',
        timestamp: '11/07/2025 15:42:21',
      },
    },
  })
  async checkHealth() {
    try {
      const healthStatus = await this.checkHealthUseCase.execute();

      if (healthStatus.status === 'unhealthy') {
        throw new HttpException(healthStatus, HttpStatus.SERVICE_UNAVAILABLE);
      }

      return healthStatus;
    } catch {
      throw new InternalServerErrorException({
        status: 'unhealthy',
        message: 'INTERNAL SERVER ERROR',
        timestamp: new Date().toLocaleString('pt-br', {
          timeZone: 'America/Sao_paulo',
        }),
      });
    }
  }
}
