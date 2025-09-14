import { Injectable } from '@nestjs/common';
import { HealthRepository } from '../../domain/repositories/health.repository';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaHealthRepository implements HealthRepository {
  constructor(private readonly prisma: PrismaService) {}
  async checkConnection(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.log(
        'db connection error: ',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }
}
