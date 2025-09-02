import { Injectable } from '@nestjs/common';
import { DatabaseRepository } from '@/modules/app/domain/providers/database.provider';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaHealthRepository implements DatabaseRepository {
  constructor(private readonly prisma: PrismaService) {}
  async checkDatabaseConnection(): Promise<boolean> {
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
