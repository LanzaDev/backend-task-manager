import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { GetHealthUseCase } from '@/modules/app/application/use-cases/get-health.use-case';
import type { FastifyReply } from 'fastify';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('Health')
@Controller('/')
export class CheckApiHealthController {
  constructor(private readonly getHealthUseCase: GetHealthUseCase) {}

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
        status: 'unhealth',
        message: 'INTERNAL SERVER ERROR',
        timestamp: '11/07/2025 15:42:21',
      },
    },
  })
  async getHealth(@Res() res: FastifyReply) {
    try {
      const healthStatus = await this.getHealthUseCase.execute();

      return res.status(HttpStatus.OK).send(healthStatus);
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: 'unhealth',
        message: 'INTERNAL SERVER ERROR',
        timestamp: new Date().toLocaleString('pt-br', {
          timeZone: 'America/Sao_paulo',
        }),
      });
    }
  }
}
